import { Router } from "express";
import { dsm } from "../../connections";
import { Asset } from "../../entities/Asset";

const router = Router();

// Get all assets
router.get("/api/assets/", async (req, res) => {
  await dsm.find(Asset).then((data) => res.json(data));
});

export { router as assetRouter };
