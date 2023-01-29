import express from "express";
import { PortfolioItem } from "../../entity/PortfolioItem";
import { ds } from "../../connections";

export const portfolioItemRouter = express.Router();

// Get all portfolio items
portfolioItemRouter.get("/api/portfolio-items/", async (req, res) => {
  await ds.manager
    .find(PortfolioItem, {
      relations: ["portfolio", "portfolioCategory", "content", "content.asset"],
    })
    .then((data) => res.json(data));
});

// Get spesific portfolio item
portfolioItemRouter.get("/api/portfolio-items/:id", async (req, res) => {
  await ds.manager
    .findOne(PortfolioItem, {
      where: {
        id: parseInt(req.params.id),
      },
      relations: ["portfolio", "portfolioCategory", "content", "content.asset"],
    })
    .then((data) => res.json(data));
});
