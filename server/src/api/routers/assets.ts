import { Router } from "express";
import { z } from "zod";
import { ApiController as ac } from "../../apiController";
import { Asset, AssetType } from "../../entities/Asset";

const router = Router();

// Get all assets
router.get("/", async (req, res) => {
  const dbResult = await ac.findAll(Asset);
  res.json(dbResult);
});

// Get spesific asset with id
router.get("/:id", async (req, res) => {
  const ctxObj = ac.initContext({
    zInput: { params: z.object({ id: z.preprocess(Number, z.number()) }) },
    reqData: { params: req.params },
  });

  const validateResults = await ac.inputValidate(ctxObj);
  const dbResults = await ac.findOne(Asset, validateResults, {
    where: {
      id: validateResults.result.params?.id,
    },
  });

  res.json(dbResults);
});

// Post an asset
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
  const dbResult = await ac.add(Asset, validateResults);
  res.json(dbResult);
});

// Remove and asset
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
  const dbResult = await ac.remove(Asset, validateResults);
  res.json(dbResult);
});

// Update the asset
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
  const dbResult = await ac.update(Asset, validateResults);
  res.json(dbResult);
});

export { router as assetRouter };
