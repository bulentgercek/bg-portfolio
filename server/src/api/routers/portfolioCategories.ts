import { Router } from "express";
import { ApiController as ac } from "../validations/apiController";
import { PortfolioCategory } from "../../entities/PortfolioCategory";

const router = Router();

// Get all portfolio categories
router.get("/api/portfolio-categories/", async (req, res) => {
  const dbResults = await ac.find(PortfolioCategory, {
    relations: {
      portfolio: true,
      portfolioItem: true,
    },
  });

  res.json(dbResults);
});

export { router as portfolioCategoryRouter };
