import express from "express";
import { PortfolioCategory } from "../../entities/PortfolioCategory";
import { dsm } from "../../connections";

export const router = express.Router();

// Get all portfolio categories
router.get("/api/portfolio-categories/", async (req, res) => {
  await dsm
    .find(PortfolioCategory, {
      relations: { portfolio: true, portfolioItem: true },
    })
    .then((data) => res.json(data));
});

export { router as portfolioCategoryRouter };
