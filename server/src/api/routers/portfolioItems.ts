import express from "express";
import { PortfolioItem } from "../../entity/PortfolioItem";
import { dsm } from "../../connections";

export const router = express.Router();

// Get all portfolio items
router.get("/api/portfolio-items/", async (req, res) => {
  await dsm
    .find(PortfolioItem, {
      select: {
        portfolioCategory: {
          id: true,
          name: true,
        },
      },
      relations: { portfolioCategory: true, content: { asset: true } },
    })
    .then((data) => res.json(data))
    .catch((e) => console.log(e));
});

// Get spesific portfolio item - with filtering
router.get("/api/portfolio-items/:id", async (req, res) => {
  await dsm
    .findOne(PortfolioItem, {
      select: {
        portfolioCategory: {
          id: true,
          name: true,
        },
      },
      where: {
        id: parseInt(req.params.id),
      },
      relations: { portfolioCategory: true, content: { asset: true } },
    })
    .then((data) => res.json(data))
    .catch((e) => console.log(e));
});

export { router as portfolioItemRouter };
