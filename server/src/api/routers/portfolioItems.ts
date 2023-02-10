import { Router } from "express";
import { z } from "zod";
import { ApiController as ac } from "../apiController";
import { PortfolioItem } from "../../entities/PortfolioItem";

const router = Router();

// Get all portfolio items
router.get("/api/portfolio-items/", async (req, res) => {
  const dbResults = await ac.find(PortfolioItem, {
    select: {
      portfolioCategory: {
        id: true,
        name: true,
      },
    },
    relations: {
      portfolioCategory: true,
      content: {
        asset: true,
      },
    },
  });

  res.json(dbResults);
});

// Get spesific portfolio item - with filtering
router.get("/api/portfolio-items/:id", async (req, res) => {
  const ctxObj = ac.initContext({
    zInput: z.object({ id: z.preprocess(Number, z.number()) }),
    reqData: req.params,
  });

  const validateResults = await ac.inputValidate(ctxObj);
  const dbResults = await ac.findOne(
    PortfolioItem,
    {
      select: {
        portfolioCategory: {
          id: true,
          name: true,
        },
      },
      where: {
        id: validateResults.result.id,
      },
      relations: { portfolioCategory: true, content: { asset: true } },
    },
    validateResults,
  );

  res.json(dbResults);
});

export { router as portfolioItemRouter };
