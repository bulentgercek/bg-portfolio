import { Router } from "express";
import { In } from "typeorm";
import { z } from "zod";
import { ApiController as ac } from "../../apiController";
import { Asset, AssetType } from "../../entities/Asset";
import { Content } from "../../entities/Content";
import { filterObject } from "../../utils";

const router = Router();

// Get all assets
router.get("/", async (req, res) => {
  const validateResults = await ac.inputValidate();
  const dbAssets = await ac
    .findAll(Asset, validateResults, {
      select: {
        contents: {
          id: true,
          name: true,
        },
      },
      relations: {
        contents: true,
      },
    })
    .catch((err) => console.log(err));

  res.json(dbAssets);
});

// Get spesific asset with id
router.get("/:id", async (req, res) => {
  const ctxObj = ac.initContext({
    zInput: { params: z.object({ id: z.preprocess(Number, z.number()) }) },
    reqData: { params: req.params },
  });

  const validateResults = await ac.inputValidate(ctxObj);
  const dbAsset = await ac
    .findOne(Asset, validateResults, {
      select: {
        contents: {
          id: true,
          name: true,
        },
      },
      relations: {
        contents: true,
      },
    })
    .catch((err) => console.log(err));

  res.json(dbAsset);
});

// Add an Asset
router.post("/", async (req, res) => {
  const ctxObj = ac.initContext({
    zInput: {
      body: z.object({
        name: z.string().optional(),
        type: z.nativeEnum(AssetType).optional(),
        text: z.string().optional(),
        url: z.string().url().optional(),
        contents: z.array(z.number()).optional(),
      }),
    },
    reqData: { body: req.body },
  });

  const validateResults = await ac.inputValidate(ctxObj);

  // Guard Clause for filtering Body
  if (!validateResults.success.body || !validateResults.result.body) return;

  // Filter out the relational inputs before updating dbContent
  const filteredBody: Partial<Asset> = filterObject(
    validateResults.result.body,
    "contents",
  );

  // Create new Asset
  const createdAsset = ac.create(Asset, filteredBody);

  // Get Content
  if (validateResults.result.body.contents) {
    const dbCategories = await ac.findAll(Content, validateResults, {
      where: {
        id: In(validateResults.result.body.contents),
      },
    });

    // is validated?
    if (Array.isArray(dbCategories)) {
      createdAsset.contents = dbCategories;
    }
  }

  const savedAsset = await ac
    .addCreated(Asset, validateResults, createdAsset)
    .catch((err) => console.log(err));

  res.json(savedAsset);
});

// Update the asset with id
router.put("/:id", async (req, res) => {
  const ctxObj = ac.initContext({
    zInput: {
      params: z.object({ id: z.preprocess(Number, z.number()) }),
      body: z.object({
        name: z.string().optional(),
        type: z.nativeEnum(AssetType).optional(),
        url: z.string().url().optional(),
        text: z.string().optional(),
      }),
    },
    reqData: { params: req.params, body: req.body },
  });

  const validateResults = await ac.inputValidate(ctxObj);
  const updatedAsset = await ac
    .update(Asset, validateResults)
    .catch((err) => console.log(err));

  res.json(updatedAsset);
});

// Remove an asset with id
router.delete("/:id", async (req, res) => {
  const ctxObj = ac.initContext({
    zInput: {
      params: z.object({
        id: z.preprocess(Number, z.number()),
      }),
    },
    reqData: { params: req.params },
  });

  const validateResults = await ac.inputValidate(ctxObj);
  const removedAsset = await ac
    .remove(Asset, validateResults)
    .catch((err) => console.log(err));

  res.json(removedAsset);
});

export { router as assetRouter };
