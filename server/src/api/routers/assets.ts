import express from "express";
import { Asset } from "../../entities/Asset";
import { dsm } from "../../connections";

const router = express.Router();

// Get all assets
router.get("/api/assets/", async (req, res) => {
  await dsm.find(Asset).then((data) => res.json(data));
});

export { router as assetRouter };
