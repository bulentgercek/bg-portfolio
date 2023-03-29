import { Router } from "express";
import { In } from "typeorm";
import { z } from "zod";
import { ApiController as ac } from "../../apiController";
import { Category } from "../../entities/Category";
import { filterObject } from "../../utils";

const router = Router();

// Get all Categories
router.get("/", async (req, res) => {
  const validateResults = await ac.inputValidate();
  const dbCategories = await ac
    .findAll(Category, validateResults, {
      relations: {
        parentCategories: true,
        childCategories: true,
        items: {
          contents: true,
        },
      },
    })
    .catch((err) => console.log(err));

  res.json(dbCategories);
});

// Get spesific category with id
router.get("/:id", async (req, res) => {
  const ctxObj = ac.initContext({
    zInput: { params: z.object({ id: z.preprocess(Number, z.number()) }) },
    reqData: { params: req.params },
  });

  const validateResults = await ac.inputValidate(ctxObj);
  const dbCategory = await ac
    .findOne(Category, validateResults, {
      where: {
        id: validateResults.result.params?.id,
      },
      relations: {
        parentCategories: true,
        items: {
          contents: true,
        },
      },
    })
    .catch((err) => console.log(err));

  res.json(dbCategory);
});

// Add a Category
router.post("/", async (req, res) => {
  const ctxObj = ac.initContext({
    zInput: {
      body: z.object({
        name: z.string().optional(),
        description: z.string().nullable().optional(),
        parentCategories: z.array(z.number()).optional(),
      }),
    },
    reqData: { body: req.body },
  });

  const validateResults = await ac.inputValidate(ctxObj);

  // Guard clause
  if (!validateResults.success.body || !validateResults.result.body) return;

  // Filter out the relational inputs before create
  const filteredBody = filterObject(
    validateResults.result.body,
    "parentCategories",
  );

  // Create new Category
  const createdCategory = ac.create(Category, filteredBody);

  // Add ParentCategories
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

  const addedCategory = await ac
    .addCreated(Category, validateResults, createdCategory)
    .catch((err) => console.log(err));

  res.json(addedCategory);
});

// Update a Category
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
      }),
    },
    reqData: { params: req.params, body: req.body },
  });

  const validateResults = await ac.inputValidate(ctxObj);

  const dbCategory = await ac
    .findOne(Category, validateResults, {
      where: {
        id: validateResults.result.params?.id,
      },
      relations: {
        parentCategories: true,
      },
    })
    .catch((err) => console.log(err));

  if (!(dbCategory instanceof Category))
    return res.status(400).json(validateResults);

  // Guard clause before filtering Body
  if (!validateResults.success.body || !validateResults.result.body) return;

  // Filter out the relational inputs before create
  const filteredBody: Partial<Category> = filterObject(
    validateResults.result.body,
    "parentCategories",
  );

  const updatedCategory: Category = { ...dbCategory, ...filteredBody };

  if (validateResults.result.body.parentCategories) {
    const dbCategories = await ac
      .findAll(Category, validateResults, {
        where: {
          id: In(validateResults.result.body.parentCategories),
        },
      })
      .catch((err) => console.log(err));

    if (Array.isArray(dbCategories))
      updatedCategory.parentCategories = dbCategories;
  }

  const finalUpdatedCategory = await ac
    .updateWithTarget(Category, validateResults, updatedCategory)
    .catch((err) => console.log(err));

  res.json(finalUpdatedCategory);
});

// Delete spesific category with id
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
