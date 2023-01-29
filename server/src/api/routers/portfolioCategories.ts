import express from "express";
import { PortfolioCategory } from "../../entity/PortfolioCategory";
import { ds } from "../../connections";

export const router = express.Router();

// Get all portfolio categories
router.get("/api/portfolio_categories/", async (req, res) => {
  await ds.manager
    .find(PortfolioCategory, {
      relations: ["portfolio", "portfolioItem"],
    })
    .then((data) => res.json(data));
});

export { router as portfolioCategoryRouter };
