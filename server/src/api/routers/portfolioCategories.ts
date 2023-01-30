import express from "express";
import { PortfolioCategory } from "../../entity/PortfolioCategory";
import { dsm } from "../../connections";

export const router = express.Router();

// Get all portfolio categories
router.get("/api/portfolio_categories/", async (req, res) => {
  await dsm
    .find(PortfolioCategory, {
      relations: ["portfolio", "portfolioItem"],
    })
    .then((data) => res.json(data));
});

export { router as portfolioCategoryRouter };
