import { Router } from "express";
import { z } from "zod";
import { ApiController as ac } from "../apiController";
import { Asset } from "../../entities/Asset";

const router = Router();

// Get all assets
router.get("/api/assets/", async (req, res) => {
  const dbResult = await ac.find(Asset);
  res.json(dbResult);
});

// Get all assets
router.get("/api/assets/:id", async (req, res) => {
  const ctxObj = ac.initContext({
    zInput: z.object({ id: z.preprocess(Number, z.number()) }),
    reqData: req.params,
  });

  const validateResults = await ac.inputValidate(ctxObj);
  const dbResults = await ac.findOne(
    Asset,
    {
      where: {
        id: validateResults.result.id,
      },
    },
    validateResults,
  );

  res.json(dbResults);
});

export { router as assetRouter };
