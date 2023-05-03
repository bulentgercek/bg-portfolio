import { Router } from "express";
import { z } from "zod";
import { ApiController as ac } from "../../apiController";
import { Item } from "../../entities/Item";
import { Content, ContentType } from "../../entities/Content";
import { Category } from "../../entities/Category";
import { In } from "typeorm";
import { filterObject } from "../../utils";
import { Asset, AssetType } from "../../entities/Asset";

const router = Router();

// Get Items
router.get("/", async (req, res) => {
  const dbItems = await ac
    .findAll(Item, {
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
    })
    .catch((err) => console.log(err));

  res.json(dbItems);
});

// Get Item
router.get("/:id", async (req, res) => {
  const ctxObj = ac.initContext({
    zInput: {
      params: z.object({ id: z.preprocess(Number, z.number()) }),
    },
    reqData: {
      params: req.params,
    },
  });

  const validateResults = await ac.inputValidate(ctxObj);
  const dbPortfolioItem = await ac.findOne(Item, validateResults, {
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
});

// Get Contents of Item
router.get("/:id/contents", async (req, res) => {
  const ctxObj = ac.initContext({
    zInput: { params: z.object({ id: z.preprocess(Number, z.number()) }) },
    reqData: { params: req.params },
  });

  const validateResults = await ac.inputValidate(ctxObj);
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
});

// Get Content of Item
router.get("/:id/contents/:cid", async (req, res) => {
  const ctxObj = ac.initContext({
    zInput: {
      params: z.object({
        id: z.preprocess(Number, z.number()),
        cid: z.preprocess(Number, z.number()),
      }),
    },
    reqData: { params: req.params },
  });

  const validateResults = await ac.inputValidate(ctxObj);
  const dbContent = await ac.findOne(Content, validateResults, {
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
});

// Add Item
router.post("/", async (req, res) => {
  const ctxObj = ac.initContext({
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

  const validateResults = await ac.inputValidate(ctxObj);

  // Guard clause
  if (!validateResults.success.body || !validateResults.result.body) return res.status(400).json(validateResults);

  // Filter out the relational inputs before create
  const filteredBody = filterObject(validateResults.result.body, "featuredImageAsset", "categories");

  // Create new Item
  const createdItem = ac.create(Item, filteredBody);

  // Add featured image Asset
  if (validateResults.result.body.featuredImageAsset) {
    const dbAsset = await ac.findOne(Asset, validateResults, {
      where: {
        id: validateResults.result.body.featuredImageAsset,
      },
    });

    // is validated? is AssetType.Image?
    if (dbAsset.dbData instanceof Asset && dbAsset.dbData.type === AssetType.Image) {
      createdItem.featuredImageAsset = dbAsset.dbData;
    }
  }

  // Add Categories
  if (validateResults.result.body.categories) {
    const dbCategories = await ac.findAll(Category, {
      where: {
        id: In(validateResults.result.body.categories),
      },
    });

    // is validated?
    if (Array.isArray(dbCategories.dbData)) {
      createdItem.categories = dbCategories.dbData;
    }
  }

  const addedItem = await ac.addCreated(Item, validateResults, createdItem);
  return res.json(addedItem);
});

// Update Item
// Note : We do not add content here.
// Because Content will be just like adding Item
// (because Content without Item relation cannot be created),
// it is pointless to update it.
router.put("/:id", async (req, res) => {
  const ctxObj = ac.initContext({
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
        categories: z.array(z.number()).optional(),
      }),
    },
    reqData: {
      params: req.params,
      body: req.body,
    },
  });

  const validateResults = await ac.inputValidate(ctxObj);

  // Get Item
  const dbItem = await ac.findOne(Item, validateResults, {
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
    where: {
      id: validateResults.result.params?.id,
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

  // Guard clause for Item
  if (!(dbItem.dbData instanceof Item)) return res.status(400).json(validateResults);

  // Guard clause for filtering Body
  if (!validateResults.success.body || !validateResults.result.body) return res.status(400).json(validateResults);

  // Filter out the relational inputs before create updatedItem
  const filteredBody: Partial<Item> = filterObject(validateResults.result.body, "featuredImageAsset", "categories");

  // Update values of dbItem with filteredBody
  const updatedItem: Item = {
    ...dbItem.dbData,
    ...filteredBody,
  };

  // Add featured image Asset
  if (validateResults.result.body.featuredImageAsset) {
    const dbAsset = await ac.findOne(Asset, validateResults, {
      where: {
        id: validateResults.result.body.featuredImageAsset,
      },
    });

    // is validated? is AssetType.Image?
    if (dbAsset.dbData instanceof Asset && dbAsset.dbData.type === AssetType.Image) {
      updatedItem.featuredImageAsset = dbAsset.dbData;
    }
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

    // is validated?
    if (Array.isArray(dbCategories.dbData)) updatedItem.categories = dbCategories.dbData;
  }

  const finalUpdatedItem = await ac.updateWithTarget(Item, validateResults, updatedItem);

  res.json(finalUpdatedItem);
});

// Remove Item
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
  const removedItem = await ac.remove(Item, validateResults);

  res.json(removedItem);
});

export { router as itemRouter };
