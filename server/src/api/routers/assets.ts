import { Router } from "express";
import { z } from "zod";
import { dsm } from "../../connections";
import { Asset } from "../../entities/Asset";
import * as ApiHandler from "../validations/apiHandler";

const router = Router();

// Get all assets
router.get("/api/assets/", async (req, res) => {
  await dsm.find(Asset).then((data) => res.json(data));
});

// Get all assets
router.get("/api/assets/:id", async (req, res) => {
  await ApiHandler.validate(
    z.object({ id: z.preprocess(Number, z.number()) }),
    req.params,
  ).then(async (output) => {
    if (!output.validateSuccess) return res.json(output);
    await dsm
      .findOne(Asset, {
        where: {
          id: output.validateResults.id,
        },
      })
      .then((data) => res.json(data));
  });
});

export { router as assetRouter };
