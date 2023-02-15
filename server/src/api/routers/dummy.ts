import { Router } from "express";
import * as dummy from "../dummyData";

const router = Router();

// Add dummy assets
router.post("/", async (req, res) => {
  // Cleaning all entries in tables. This is not resetting Auto Increment on ID's
  await dummy.cleanAllEntities();

  // Add dummy entries
  await dummy.addDummyPortfolio();
  await dummy.addDummyPortfolioCategories();
  await dummy.addDummyPortfolioItems();
  await dummy.addDummyAssets();
  await dummy.addDummyContent();
  await dummy.updateDummyPortfolioItems();
  res.json("It's DONE!");
});

export { router as dummyRouter };
