import { Router } from "express";
import { In } from "typeorm";
import { z } from "zod";
import { ApiController as ac } from "../../apiController";
import { Category } from "../../entities/Category";
import { Item } from "../../entities/Item";
import { filterObject } from "../../utils";

const router = Router();

// Get Categories
router.get("/", async (req, res) => {
  const validateResults = await ac.inputValidate();
  const dbCategories = await ac
    .findAll(Category, validateResults, {
      select: {
        items: {
          id: true,
          name: true,
          description: true,
          featured: true,
          updatedDate: true,
        },
        parentCategories: {
          id: true,
          name: true,
        },
        childCategories: {
          id: true,
          name: true,
        },
      },
      relations: {
        items: true,
        parentCategories: true,
        childCategories: true,
      },
    })
    .catch((err) => console.log(err));

  res.json(dbCategories);
});

// Get Category
router.get("/:id", async (req, res) => {
  const ctxObj = ac.initContext({
    zInput: { params: z.object({ id: z.preprocess(Number, z.number()) }) },
    reqData: { params: req.params },
  });

  const validateResults = await ac.inputValidate(ctxObj);
  const dbCategory = await ac
    .findOne(Category, validateResults, {
      select: {
        parentCategories: {
          id: true,
          name: true,
        },
        childCategories: {
          id: true,
          name: true,
        },
      },
      where: {
        id: validateResults.result.params?.id,
      },
      relations: {
        items: {
          contents: {
            assets: true,
          },
        },
        parentCategories: true,
        childCategories: true,
      },
    })
    .catch((err) => console.log(err));

  res.json(dbCategory);
});

// Add Category
router.post("/", async (req, res) => {
  const ctxObj = ac.initContext({
    zInput: {
      body: z.object({
        name: z.string().optional(),
        description: z.string().nullable().optional(),
        items: z.array(z.number()).optional(),
        parentCategories: z.array(z.number()).optional(),
        childCategories: z.array(z.number()).optional(),
      }),
    },
    reqData: { body: req.body },
  });

  const validateResults = await ac.inputValidate(ctxObj);

  // Guard clause
  if (!validateResults.success.body || !validateResults.result.body)
    return res.status(400).json(validateResults);

  // Filter out the relational inputs before create
  const filteredBody = filterObject(
    validateResults.result.body,
    "items",
    "parentCategories",
    "childCategories",
  );

  // Create new Category
  const createdCategory = ac.create(Category, filteredBody);

  // Get Items
  if (validateResults.result.body.items) {
    const dbItems = await ac
      .findAll(Item, validateResults, {
        where: {
          id: In(validateResults.result.body?.items),
        },
      })
      .catch((err) => console.log(err));

    if (Array.isArray(dbItems)) {
      createdCategory.items = dbItems;
    }
  }

  // Add parent categories
  if (validateResults.result.body.parentCategories) {
    const dbParentCategories = await ac.findAll(Category, validateResults, {
      where: {
        id: In(validateResults.result.body.parentCategories),
      },
    });

    // is validated?
    if (Array.isArray(dbParentCategories)) {
      createdCategory.parentCategories = dbParentCategories;
    }
  }

  // Add child categories
  if (validateResults.result.body.childCategories) {
    const dbChildCategories = await ac.findAll(Category, validateResults, {
      where: {
        id: In(validateResults.result.body.childCategories),
      },
    });

    // is validated?
    if (Array.isArray(dbChildCategories)) {
      createdCategory.parentCategories = dbChildCategories;
    }
  }

  const addedCategory = await ac
    .addCreated(Category, validateResults, createdCategory)
    .catch((err) => console.log(err));

  res.json(addedCategory);
});

// Update Category
router.put("/:id", async (req, res) => {
  const ctxObj = ac.initContext({
    zInput: {
      params: z.object({
        id: z.preprocess(Number, z.number()),
      }),
      body: z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        items: z.array(z.number()).optional(),
        parentCategories: z.array(z.number()).optional(),
        childCategories: z.array(z.number()).optional(),
      }),
    },
    reqData: { params: req.params, body: req.body },
  });

  const validateResults = await ac.inputValidate(ctxObj);

  // Get Category
  const dbCategory = await ac
    .findOne(Category, validateResults, {
      where: {
        id: validateResults.result.params?.id,
      },
      relations: {
        parentCategories: true,
        childCategories: true,
      },
    })
    .catch((err) => console.log(err));

  if (!(dbCategory instanceof Category))
    return res.status(400).json(validateResults);

  // Guard clause before filtering Body
  if (!validateResults.success.body || !validateResults.result.body)
    return res.status(400).json(validateResults);

  // Filter out the relational inputs before create
  const filteredBody: Partial<Category> = filterObject(
    validateResults.result.body,
    "items",
    "parentCategories",
    "childCategories",
  );

  // Override Given Values
  const updatedCategory: Category = { ...dbCategory, ...filteredBody };

  // Get Items
  if (validateResults.result.body.items) {
    const dbItems = await ac
      .findAll(Item, validateResults, {
        where: {
          id: In(validateResults.result.body.items),
        },
      })
      .catch((err) => console.log(err));

    if (Array.isArray(dbItems)) {
      updatedCategory.items = dbItems;
    }
  }

  // Add parent categories
  if (validateResults.result.body.parentCategories) {
    const dbParentCategories = await ac
      .findAll(Category, validateResults, {
        where: {
          id: In(validateResults.result.body.parentCategories),
        },
      })
      .catch((err) => console.log(err));

    if (Array.isArray(dbParentCategories))
      updatedCategory.parentCategories = dbParentCategories;
  }

  // Add child categories
  if (validateResults.result.body.childCategories) {
    const dbChildCategories = await ac
      .findAll(Category, validateResults, {
        where: {
          id: In(validateResults.result.body.childCategories),
        },
      })
      .catch((err) => console.log(err));

    if (Array.isArray(dbChildCategories))
      updatedCategory.childCategories = dbChildCategories;
  }

  const finalUpdatedCategory = await ac
    .updateWithTarget(Category, validateResults, updatedCategory)
    .catch((err) => console.log(err));

  res.json(finalUpdatedCategory);
});

// Delete Category
router.delete("/:id", async (req, res) => {
  const ctxObj = ac.initContext({
    zInput: {
      params: z.object({
        id: z.preprocess(Number, z.number()),
      }),
    },
    reqData: {
      params: req.params,
    },
  });

  const validateResults = await ac.inputValidate(ctxObj);
  const removedPortfolioCategory = await ac.remove(Category, validateResults);

  res.json(removedPortfolioCategory);
});

export { router as categoryRouter };
