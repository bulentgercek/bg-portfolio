import express from "express";
import { PortfolioCategory } from "../../entity/PortfolioCategory";
import { ds } from "../../connections";

export const portfolioCategoryRouter = express.Router();

// Get all portfolio categories
portfolioCategoryRouter.get("/api/portfolio_categories/", async (req, res) => {
  await ds.manager
    .find(PortfolioCategory, {
      relations: ["portfolio", "portfolioItem"],
    })
    .then((data) => res.json(data));
});
