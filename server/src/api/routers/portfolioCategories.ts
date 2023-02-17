import { Router } from "express";
import { z } from "zod";
import { ApiController as ac } from "../../apiController";
import { PortfolioCategory } from "../../entities/PortfolioCategory";

const router = Router();

// Get all portfolio categories
router.get("/", async (req, res) => {
  const validateResults = await ac.inputValidate();
  const dbPortfolioCategories = await ac.findAll(
    PortfolioCategory,
    validateResults,
    {
      select: {
        portfolio: {
          id: true,
          name: true,
        },
      },
      relations: {
        portfolio: true,
      },
    },
  );

  res.json(dbPortfolioCategories);
});

// Get spesific portfolio category with id
router.get("/:id", async (req, res) => {
  const ctxObj = ac.initContext({
    zInput: {
      params: z.object({
        id: z.preprocess(Number, z.number()),
      }),
    },
    reqData: {
      params: req.params,
    },
  });

  const validateResults = await ac.inputValidate(ctxObj);
  const dbPortfolioCategory = await ac.findOne(
    PortfolioCategory,
    validateResults,
    {
      relations: {
        portfolio: true,
        portfolioItem: true,
      },
    },
  );

  res.json(dbPortfolioCategory);
});

// Delete spesific portfolio category with id
router.delete("/:id", async (req, res) => {
  const ctxObj = ac.initContext({
    zInput: {
      params: z.object({
        id: z.preprocess(Number, z.number()),
      }),
    },
    reqData: {
      params: req.params,
    },
  });

  const validateResults = await ac.inputValidate(ctxObj);
  const removedPortfolioCategory = await ac.remove(
    PortfolioCategory,
    validateResults,
  );

  res.json(removedPortfolioCategory);
});

export { router as portfolioCategoryRouter };
