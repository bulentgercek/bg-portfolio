import { Router } from "express";
import { z } from "zod";
import { ApiController as ac } from "../../apiController";
import { Item } from "../../entities/Item";
import { Content, ContentType } from "../../entities/Content";
import { Category } from "../../entities/Category";
import { In } from "typeorm";
import { filterObject } from "../../utils";
import { Asset, AssetType } from "../../entities/Asset";
import { consoleRouteError } from "../../errorHandler";

const router = Router();

// Get Items
router.get("/", async (req, res, next) => {
  try {
    const dbItems = await ac.findAll(Item, {
      select: {
        featuredImageAsset: {
          id: true,
          name: true,
          url: true,
        },
        categories: {
          id: true,
          name: true,
          parentCategory: {
            id: true,
            name: true,
          },
          childCategories: {
            id: true,
            name: true,
          },
        },
      },
      relations: {
        featuredImageAsset: true,
        categories: {
          parentCategory: true,
          childCategories: true,
        },
        contents: {
          assets: true,
        },
      },
      order: {
        name: "ASC",
      },
    });

    res.json(dbItems);
  } catch (error) {
    consoleRouteError(error, req);
    next(error);
  }
});

// Get Item
router.get("/:id", async (req, res, next) => {
  try {
    const validateResults = await ac.inputValidate({
      zInput: {
        params: z.object({ id: z.preprocess(Number, z.number()) }),
      },
      reqData: {
        params: req.params,
      },
    });

    const dbPortfolioItem = await ac.findOne(Item, {
      where: {
        id: validateResults.result.params?.id,
      },
      select: {
        featuredImageAsset: {
          id: true,
          name: true,
          url: true,
        },
        categories: {
          id: true,
          name: true,
          parentCategory: {
            id: true,
            name: true,
          },
          childCategories: {
            id: true,
            name: true,
          },
        },
      },
      relations: {
        featuredImageAsset: true,
        categories: {
          parentCategory: true,
          childCategories: true,
        },
        contents: {
          assets: true,
        },
      },
    });

    res.json(dbPortfolioItem);
  } catch (error) {
    consoleRouteError(error, req);
    next(error);
  }
});

// Get Contents of Item
router.get("/:id/contents", async (req, res, next) => {
  try {
    const validateResults = await ac.inputValidate({
      zInput: { params: z.object({ id: z.preprocess(Number, z.number()) }) },
      reqData: { params: req.params },
    });
    const dbContents = await ac.findAll(Content, {
      where: {
        item: {
          id: validateResults.result.params?.id,
        },
      },
      relations: {
        assets: true,
      },
    });

    res.json(dbContents);
  } catch (error) {
    consoleRouteError(error, req);
    next(error);
  }
});

// Get Content of Item
router.get("/:id/contents/:cid", async (req, res, next) => {
  try {
    const validateResults = await ac.inputValidate({
      zInput: {
        params: z.object({
          id: z.preprocess(Number, z.number()),
          cid: z.preprocess(Number, z.number()),
        }),
      },
      reqData: { params: req.params },
    });

    const dbContent = await ac.findOne(Content, {
      where: {
        id: validateResults.result.params?.cid,
        item: {
          id: validateResults.result.params?.id,
        },
      },
      relations: {
        assets: true,
      },
    });

    res.json(dbContent);
  } catch (error) {
    consoleRouteError(error, req);
    next(error);
  }
});

// Add Item
router.post("/", async (req, res, next) => {
  try {
    const validateResults = await ac.inputValidate({
      zInput: {
        body: z.object({
          name: z.string().optional(),
          description: z.string().optional(),
          link: z.string().url().optional(),
          featured: z.boolean().optional(),
          featuredImageAsset: z.number().optional(),
          categories: z.array(z.number()).optional(),
        }),
      },
      reqData: { body: req.body },
    });

    // Filter out the relational inputs before create
    const filteredBody = filterObject(validateResults.result.body, "featuredImageAsset", "categories");

    // Create new Item
    const createdItem = ac.create(Item, filteredBody);

    // Add featured image Asset
    if (validateResults.result.body.featuredImageAsset) {
      const dbAsset = await ac.findOne(Asset, {
        where: {
          id: validateResults.result.body.featuredImageAsset,
        },
      });

      createdItem.featuredImageAsset = dbAsset;
    }

    // Add Categories
    if (validateResults.result.body.categories) {
      const dbCategories = await ac.findAll(Category, {
        where: {
          id: In(validateResults.result.body.categories),
        },
      });

      // is validated?
      createdItem.categories = dbCategories;
    }

    const addedItem = await ac.addCreated(Item, createdItem);
    return res.json(addedItem);
  } catch (error) {
    consoleRouteError(error, req);
    next(error);
  }
});

// Update Item
// Note : We do not add content here.
// Because Content will be just like adding Item
// (because Content without Item relation cannot be created),
// it is pointless to update it.
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
          link: z.string().optional(),
          featured: z.boolean().optional(),
          featuredImageAsset: z.number().or(z.null()).optional(),
          categories: z.array(z.number()).or(z.null()).optional(),
        }),
      },
      reqData: {
        params: req.params,
        body: req.body,
      },
    });

    // Get Item
    const dbItem = await ac.findOne(Item, {
      where: {
        id: validateResults.result.params?.id,
      },
      select: {
        featuredImageAsset: {
          id: true,
          name: true,
          url: true,
        },
        categories: {
          id: true,
          name: true,
          parentCategory: {
            id: true,
            name: true,
          },
          childCategories: {
            id: true,
            name: true,
          },
        },
      },

      relations: {
        featuredImageAsset: true,
        categories: {
          parentCategory: true,
          childCategories: true,
        },
        contents: {
          assets: true,
        },
      },
    });

    // Filter out the relational inputs before create updatedItem
    const filteredBody: Partial<Item> = filterObject(validateResults.result.body, "featuredImageAsset", "categories");

    // Update values of dbItem with filteredBody
    const updatedItem: Item = {
      ...dbItem,
      ...filteredBody,
    };

    // Add featured image Asset
    if (validateResults.result.body.featuredImageAsset) {
      const dbAsset = await ac.findOne(Asset, {
        where: {
          id: validateResults.result.body.featuredImageAsset,
        },
      });

      updatedItem.featuredImageAsset = dbAsset;
    }

    // Is featuredImageAsset required to be null?
    if (validateResults.result.body.featuredImageAsset === null) updatedItem.featuredImageAsset = null;

    // Add Categories
    if (validateResults.result.body.categories) {
      const dbCategories = await ac.findAll(Category, {
        where: {
          id: In(validateResults.result.body.categories),
        },
      });

      updatedItem.categories = dbCategories;
    }

    const finalUpdatedItem = await ac.updateWithTarget(Item, updatedItem);

    res.json(finalUpdatedItem);
  } catch (error) {
    consoleRouteError(error, req);
    next(error);
  }
});

// Remove Item
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
    const removedItem = await ac.remove(Item, validateResults);

    res.json(removedItem);
  } catch (error) {
    consoleRouteError(error, req);
    next(error);
  }
});

export { router as itemRouter };
