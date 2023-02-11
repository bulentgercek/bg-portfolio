import { Router } from "express";
import { z } from "zod";
import { ApiController as ac } from "../apiController";
import { Portfolio } from "../../entities/Portfolio";

const router = Router();

router.get("/api/portfolios/", async (req, res) => {
  const dbResults = await ac.findAll(Portfolio, {
    relations: {
      portfolioCategory: true,
      portfolioItem: {
        content: true,
      },
    },
  });

  res.json(dbResults);
});

// Get spesific portfolio with id
router.get("/api/portfolios/:id", async (req, res) => {
  const ctxObj = ac.initContext({
    zInput: z.object({ id: z.preprocess(Number, z.number()) }),
    reqData: req.params,
  });

  const validateResults = await ac.inputValidate(ctxObj);
  const dbResults = await ac.findOne(Portfolio, validateResults, {
    where: {
      id: validateResults.result.id,
    },
    relations: {
      portfolioCategory: true,
      portfolioItem: {
        content: true,
      },
    },
  });

  res.json(dbResults);
});

export { router as portfolioRouter };
