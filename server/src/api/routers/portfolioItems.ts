import express from "express";
import { PortfolioItem } from "../../entity/PortfolioItem";
import { dsm } from "../../connections";

export const router = express.Router();

// Get all portfolio items
router.get("/api/portfolio-items/", async (req, res) => {
  await dsm
    .find(PortfolioItem, {
      relations: ["portfolioCategory", "content", "content.asset"],
    })
    .then((data) => {
      const filteredData = data.map((portfolioItem) => ({
        ...portfolioItem,
        portfolioCategory: portfolioItem.portfolioCategory.map((portfolioCategory) => ({
          id: portfolioCategory.id,
          name: portfolioCategory.name,
        })),
      }));
      res.json(filteredData);
    })
    .catch((e) => console.log(e));
});

// Get spesific portfolio item
router.get("/api/portfolio-items/:id", async (req, res) => {
  await dsm
    .findOne(PortfolioItem, {
      where: {
        id: parseInt(req.params.id),
      },
      relations: ["portfolioCategory", "content", "content.asset"],
    })
    .then((data) => {
      const filteredData = {
        ...data,
        portfolioCategory: data.portfolioCategory.map((portfolioCategory) => ({
          id: portfolioCategory.id,
          name: portfolioCategory.name,
        })),
      };
      res.json(filteredData);
    })
    .catch((e) => console.log(e));
});

export { router as portfolioItemRouter };
