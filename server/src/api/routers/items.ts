import { Router } from "express";
import { z } from "zod";
import { ApiController as ac } from "../../apiController";
import { Item } from "../../entities/Item";
import { Content, ContentType } from "../../entities/Content";
import { Category } from "../../entities/Category";
import { In } from "typeorm";
import { filterObject } from "../../utils";

const router = Router();

// Get all Items
router.get("/", async (req, res) => {
  const validateResults = await ac.inputValidate();
  const dbItems = await ac
    .findAll(Item, validateResults, {
      select: {
        categories: {
          id: true,
          name: true,
          parentCategories: true,
        },
      },
      relations: {
        categories: {
          parentCategories: true,
        },
        contents: {
          assets: true,
        },
      },
    })
    .catch((err) => console.log(err));

  res.json(dbItems);
});

// Get spesific Item
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
  const dbPortfolioItem = await ac
    .findOne(Item, validateResults, {
      select: {
        categories: {
          id: true,
          name: true,
        },
      },
      relations: { categories: true, contents: { assets: true } },
    })
    .catch((err) => console.log(err));

  res.json(dbPortfolioItem);
});

// Get the Contents of the spesific Item
router.get("/:id/contents", async (req, res) => {
  const ctxObj = ac.initContext({
    zInput: { params: z.object({ id: z.preprocess(Number, z.number()) }) },
    reqData: { params: req.params },
  });

  const validateResults = await ac.inputValidate(ctxObj);
  const dbContents = await ac
    .findAll(Content, validateResults, {
      where: {
        item: {
          id: validateResults.result.params?.id,
        },
      },
      relations: {
        assets: true,
      },
    })
    .catch((err) => console.log(err));

  res.json(dbContents);
});

// Get the spesific Content of the spesific Item
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
  const dbContent = await ac
    .findOne(Content, validateResults, {
      where: {
        id: validateResults.result.params?.cid,
        item: {
          id: validateResults.result.params?.id,
        },
      },
      relations: {
        assets: true,
      },
    })
    .catch((err) => console.log(err));

  res.json(dbContent);
});

// Add an Item
router.post("/", async (req, res) => {
  const ctxObj = ac.initContext({
    zInput: {
      body: z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        link: z.string().url().optional(),
        categories: z.array(z.number()).optional(),
      }),
    },
    reqData: { body: req.body },
  });

  const validateResults = await ac.inputValidate(ctxObj);

  // Guard clause
  if (!validateResults.success.body || !validateResults.result.body) return;

  // Filter out the relational inputs before create
  const filteredBody = filterObject(validateResults.result.body, "categories");

  // Create new Item
  const createdItem = ac.create(Item, filteredBody);

  // Add Categories
  if (validateResults.result.body.categories) {
    const dbCategories = await ac.findAll(Category, validateResults, {
      where: {
        id: In(validateResults.result.body.categories),
      },
    });

    // is validated?
    if (Array.isArray(dbCategories)) {
      createdItem.categories = dbCategories;
    }
  }

  const addedItem = await ac.addCreated(Item, validateResults, createdItem);
  return res.json(addedItem);
});

// Add Content to a spesific Item
router.post("/:id/contents", async (req, res) => {
  const ctxObj = ac.initContext({
    zInput: {
      params: z.object({
        id: z.preprocess(Number, z.number()),
      }),
      body: z.object({
        name: z.string().optional(),
        type: z.nativeEnum(ContentType).optional(),
        columns: z.number().optional(),
      }),
    },
    reqData: { params: req.params, body: req.body },
  });

  const validateResults = await ac.inputValidate(ctxObj);
  const dbItem = await ac
    .findOne(Item, validateResults, {
      where: {
        id: validateResults.result.params?.id,
      },
      relations: {
        contents: true,
      },
    })
    .catch((err) => console.log(err));

  if (!(dbItem instanceof Item))
    return res.json(
      `No Item found with id ${validateResults.result.params?.id}.`,
    );

  const createdContent = ac.create(Content, validateResults.result.body);

  if (!(createdContent instanceof Content)) return res.json(createdContent);

  createdContent.item = dbItem;

  const savedContent = await ac
    .updateWithTarget(Content, validateResults, createdContent)
    .catch((err) => console.log(err));

  res.json(savedContent);
});

// Update an Item
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
      }),
    },
    reqData: {
      params: req.params,
      body: req.body,
    },
  });

  const validateResults = await ac.inputValidate(ctxObj);
  const updatedItem = await ac
    .update(Item, validateResults)
    .catch((err) => console.log(err));

  res.json(updatedItem);
});

// Delete Item
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
  const removedItem = await ac
    .remove(Item, validateResults)
    .catch((err) => console.log(err));

  res.json(removedItem);
});

export { router as itemRouter };