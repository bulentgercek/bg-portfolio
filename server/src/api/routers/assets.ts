import express from "express";
import { Asset } from "../../entity/Asset";
import { ds } from "../../connections";

const router = express.Router();

// Get all assets
router.get("/api/assets/", async (req, res) => {
  await ds.manager.find(Asset).then((data) => res.json(data));
});

export { router as assetRouter };
