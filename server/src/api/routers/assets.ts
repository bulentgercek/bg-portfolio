import express from "express";
import { Asset } from "../../entity/Asset";
import { ds } from "../../connections";

export const assetRouter = express.Router();

// Get all assets
assetRouter.get("/api/assets/", async (req, res) => {
  await ds.manager.find(Asset).then((data) => res.json(data));
});
