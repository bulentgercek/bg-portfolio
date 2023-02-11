import { Router } from "express";
import { z } from "zod";
import { ApiController as ac } from "../apiController";
import { Asset, AssetType } from "../../entities/Asset";

const router = Router();

// Get all assets
router.get("/api/assets", async (req, res) => {
  const dbResult = await ac.findAll(Asset);
  res.json(dbResult);
});

// Get spesific asset with id
router.get("/api/assets/:id", async (req, res) => {
  const ctxObj = ac.initContext({
    zInput: z.object({ id: z.preprocess(Number, z.number()) }),
    reqData: req.params,
  });

  const validateResults = await ac.inputValidate(ctxObj);
  const dbResults = await ac.findOne(Asset, validateResults, {
    where: {
      id: validateResults.result.id,
    },
  });

  res.json(dbResults);
});

// Post an asset
router.post("/api/assets", async (req, res) => {
  const ctxObj = ac.initContext({
    zInput: z.object({
      name: z.string(),
      type: z.nativeEnum(AssetType),
      url: z.string().url(),
    }),
    reqData: req.body,
  });

  const validateResults = await ac.inputValidate(ctxObj);
  const dbResult = await ac.add(Asset, validateResults);
  res.json(dbResult);
});

// Remove and asset
router.delete("/api/assets/:id", async (req, res) => {
  const ctxObj = ac.initContext({
    zInput: z.object({
      id: z.preprocess(Number, z.number()),
    }),
    reqData: req.params,
  });

  const validateResults = await ac.inputValidate(ctxObj);
  const dbResult = await ac.remove(Asset, validateResults);
  res.json(dbResult);
});

// Update the asset
router.put("/api/assets/:id", async (req, res) => {
  const ctxObj = ac.initContext({
    zInput: z.object({
      id: z.preprocess(Number, z.number()),
      name: z.string().optional(),
      type: z.nativeEnum(AssetType).optional(),
      url: z.string().url().optional(),
    }),
    reqData: req.body,
  });

  const validateResults = await ac.inputValidate(ctxObj);
  const dbResult = await ac.update(Asset, validateResults);
  res.json(dbResult);
});

export { router as assetRouter };
