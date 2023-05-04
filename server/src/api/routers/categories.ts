import { Router } from "express";
import { In } from "typeorm";
import { z } from "zod";
import { ApiController as ac } from "../../apiController";
import { Category } from "../../entities/Category";
import { Item } from "../../entities/Item";
import { consoleRouteError } from "../../errorHandler";
import { filterObject, sortDbArray } from "../../utils";

const router = Router();

// Get Categories
router.get("/", async (req, res, next) => {
  try {
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
    dbCategories.forEach((category) => {
      category.childCategories = sortDbArray(category.childCategories, "name");
      category.items = sortDbArray(category.items, "name");
    });

    res.json(dbCategories);
  } catch (error) {
    consoleRouteError(error, req);
    next(error);
  }
});

// Get Category
router.get("/:id", async (req, res, next) => {
  try {
    const validateResults = await ac.inputValidate({
      zInput: { params: z.object({ id: z.preprocess(Number, z.number()) }) },
      reqData: { params: req.params },
    });

    const dbCategory = await ac.findOne(Category, {
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
  } catch (error) {
    consoleRouteError(error, req);
    next(error);
  }
});

// Add Category
router.post("/", async (req, res, next) => {
  try {
    const validateResults = await ac.inputValidate({
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

      createdCategory.items = dbItems;
    }

    // Add parent category
    if (validateResults.result.body.parentCategory) {
      const dbParentCategory = await ac.findOne(Category, {
        where: {
          id: validateResults.result.body.parentCategory,
        },
      });

      createdCategory.parentCategory = dbParentCategory;
    }

    // Add child categories
    if (validateResults.result.body.childCategories) {
      const dbChildCategories = await ac.findAll(Category, {
        where: {
          id: In(validateResults.result.body.childCategories),
        },
      });

      createdCategory.childCategories = dbChildCategories;
    }

    const addedCategory = await ac.addCreated(Category, createdCategory);

    res.json(addedCategory);
  } catch (error) {
    consoleRouteError(error, req);
    next(error);
  }
});

// Update Category
router.put("/:id", async (req, res, next) => {
  try {
    const validateResults = await ac.inputValidate({
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

    // Get Category
    const dbCategory = await ac.findOne(Category, {
      where: {
        id: validateResults.result.params?.id,
      },
      relations: {
        parentCategory: true,
        childCategories: true,
      },
    });

    // Filter out the relational inputs before create
    const filteredBody: Partial<Category> = filterObject(
      validateResults.result.body,
      "items",
      "parentCategory",
      "childCategories",
    );

    // Override Given Values
    const updatedCategory = { ...dbCategory, ...filteredBody };

    // Get Items
    if (validateResults.result.body.items) {
      const dbItems = await ac.findAll(Item, {
        where: {
          id: In(validateResults.result.body.items),
        },
      });

      updatedCategory.items = dbItems;
    }

    // Add parent category
    if (validateResults.result.body.parentCategory) {
      const dbParentCategory = await ac.findOne(Category, {
        where: {
          id: validateResults.result.body.parentCategory,
        },
      });

      updatedCategory.parentCategory = dbParentCategory;
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

      if (Array.isArray(dbChildCategories)) updatedCategory.childCategories = dbChildCategories;
    }

    const finalUpdatedCategory = await ac
      .updateWithTarget(Category, updatedCategory)
      .catch((error) => console.log(error));

    res.json(finalUpdatedCategory);
  } catch (error) {
    consoleRouteError(error, req);
    next(error);
  }
});

// Delete Category
router.delete("/:id", async (req, res, next) => {
  try {
    const validateResults = await ac.inputValidate({
      zInput: {
        params: z.object({
          id: z.preprocess(Number, z.number()),
        }),
      },
      reqData: {
        params: req.params,
      },
    });
    const removedPortfolioCategory = await ac.remove(Category, validateResults);

    res.json(removedPortfolioCategory);
  } catch (error) {
    consoleRouteError(error, req);
    next(error);
  }
});

export { router as categoryRouter };
