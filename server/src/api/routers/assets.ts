import { Router } from "express";
import { z } from "zod";
import { ApiController as ac } from "../../apiController";
import { Asset, AssetType } from "../../entities/Asset";

const router = Router();

// Get all assets
router.get("/", async (req, res) => {
  const validateResults = await ac.inputValidate();
  const dbAssets = await ac
    .findAll(Asset, validateResults, {
      relations: {
        content: true,
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
    .findOne(Asset, validateResults)
    .catch((err) => console.log(err));

  res.json(dbAsset);
});

// Add an asset
router.post("/", async (req, res) => {
  const ctxObj = ac.initContext({
    zInput: {
      body: z.object({
        name: z.string(),
        type: z.nativeEnum(AssetType),
        url: z.string().url(),
      }),
    },
    reqData: { body: req.body },
  });

  const validateResults = await ac.inputValidate(ctxObj);
  const addedAsset = await ac
    .add(Asset, validateResults)
    .catch((err) => console.log(err));

  res.json(addedAsset);
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
