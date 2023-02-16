import { Router } from "express";
import { ApiController as ac } from "../../apiController";
import { PortfolioCategory } from "../../entities/PortfolioCategory";

const router = Router();

// Get all portfolio categories
router.get("/", async (req, res) => {
  const validateResults = await ac.inputValidate();
  const dbResults = await ac.findAll(PortfolioCategory, validateResults, {
    relations: {
      portfolio: true,
      portfolioItem: true,
    },
  });

  res.json(dbResults);
});

export { router as portfolioCategoryRouter };
