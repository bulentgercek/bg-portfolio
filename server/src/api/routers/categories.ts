import { Router } from "express";
import { In } from "typeorm";
import { z } from "zod";
import { ApiController as ac } from "../../apiController";
import { Category } from "../../entities/Category";
import { Item } from "../../entities/Item";
import { filterObject, sortDbArray } from "../../utils";

const router = Router();

// Get Categories
router.get("/", async (req, res) => {
  const dbCategories = await ac.findAll(Category, {
    select: {
      parentCategory: {
        id: true,
        name: true,
      },
      childCategories: {
        id: true,
        name: true,
      },
    },
    relations: {
      items: {
        contents: true,
        categories: true,
      },
      parentCategory: true,
      childCategories: true,
    },
    order: {
      name: "ASC",
    },
  });

  // Sort childCategories and items
  if (Array.isArray(dbCategories.dbData)) {
    dbCategories.dbData.forEach((category) => {
      category.childCategories = sortDbArray(category.childCategories, "name");
      category.items = sortDbArray(category.items, "name");
    });
  }

  res.json(dbCategories);
});

// Get Category
router.get("/:id", async (req, res) => {
  const ctxObj = ac.initContext({
    zInput: { params: z.object({ id: z.preprocess(Number, z.number()) }) },
    reqData: { params: req.params },
  });

  const validateResults = await ac.inputValidate(ctxObj);
  const dbCategory = await ac.findOne(Category, validateResults, {
    select: {
      parentCategory: {
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
        categories: true,
      },
      parentCategory: true,
      childCategories: true,
    },
    order: {
      name: "ASC",
    },
  });

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
        parentCategory: z.number().optional(),
        childCategories: z.array(z.number()).optional(),
      }),
    },
    reqData: { body: req.body },
  });

  const validateResults = await ac.inputValidate(ctxObj);

  // Guard clause
  if (!validateResults.success.body || !validateResults.result.body) return res.status(400).json(validateResults);

  // Filter out the relational inputs before create
  const filteredBody = filterObject(validateResults.result.body, "items", "parentCategory", "childCategories");

  // Create new Category
  const createdCategory = ac.create(Category, filteredBody);

  // Get Items
  if (validateResults.result.body.items) {
    const dbItems = await ac.findAll(Item, {
      where: {
        id: In(validateResults.result.body?.items),
      },
    });

    if (Array.isArray(dbItems.dbData)) {
      createdCategory.items = dbItems.dbData;
    }
  }

  // Add parent category
  if (validateResults.result.body.parentCategory) {
    const dbParentCategory = await ac.findOne(Category, validateResults, {
      where: {
        id: validateResults.result.body.parentCategory,
      },
    });

    // is validated?
    if (dbParentCategory.dbData instanceof Category) {
      createdCategory.parentCategory = dbParentCategory.dbData;
    }
  }

  // Add child categories
  if (validateResults.result.body.childCategories) {
    const dbChildCategories = await ac.findAll(Category, {
      where: {
        id: In(validateResults.result.body.childCategories),
      },
    });

    // is validated?
    if (Array.isArray(dbChildCategories.dbData)) {
      createdCategory.childCategories = dbChildCategories.dbData;
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
        parentCategory: z.number().optional().nullable(),
        childCategories: z.array(z.number()).optional(),
      }),
    },
    reqData: { params: req.params, body: req.body },
  });

  const validateResults = await ac.inputValidate(ctxObj);

  // Get Category
  const dbCategory = await ac.findOne(Category, validateResults, {
    where: {
      id: validateResults.result.params?.id,
    },
    relations: {
      parentCategory: true,
      childCategories: true,
    },
  });

  if (!(dbCategory.dbData instanceof Category)) return res.status(400).json(validateResults);

  // Guard clause before filtering Body
  if (!validateResults.success.body || !validateResults.result.body) return res.status(400).json(validateResults);

  // Filter out the relational inputs before create
  const filteredBody: Partial<Category> = filterObject(
    validateResults.result.body,
    "items",
    "parentCategory",
    "childCategories",
  );

  // Override Given Values
  const updatedCategory: Category = { ...dbCategory.dbData, ...filteredBody };

  // Get Items
  if (validateResults.result.body.items) {
    const dbItems = await ac.findAll(Item, {
      where: {
        id: In(validateResults.result.body.items),
      },
    });

    if (Array.isArray(dbItems.dbData)) {
      updatedCategory.items = dbItems.dbData;
    }
  }

  // Add parent category
  if (validateResults.result.body.parentCategory) {
    const dbParentCategory = await ac.findOne(Category, validateResults, {
      where: {
        id: validateResults.result.body.parentCategory,
      },
    });

    if (dbParentCategory.dbData instanceof Category) updatedCategory.parentCategory = dbParentCategory.dbData;
  } else {
    updatedCategory.parentCategory = null;
  }

  // Add child categories
  if (validateResults.result.body.childCategories) {
    const dbChildCategories = await ac.findAll(Category, {
      where: {
        id: In(validateResults.result.body.childCategories),
      },
    });

    if (Array.isArray(dbChildCategories.dbData)) updatedCategory.childCategories = dbChildCategories.dbData;
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
