import { Router } from "express";
import { z } from "zod";
import { ApiController as ac } from "../apiController";
import { PortfolioItem } from "../../entities/PortfolioItem";

const router = Router();

// Get all portfolio items
router.get("/api/portfolio-items/", async (req, res) => {
  const dbResults = await ac.findAll(PortfolioItem, {
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

// Get spesific portfolio item
router.get("/api/portfolio-items/:id", async (req, res) => {
  const ctxObj = ac.initContext({
    zInput: z.object({ id: z.preprocess(Number, z.number()) }),
    reqData: req.params,
  });

  const validateResults = await ac.inputValidate(ctxObj);
  const dbResults = await ac.findOne(PortfolioItem, validateResults, {
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
  });

  res.json(dbResults);
});

// Get the contents of the spesific Portfolio Item
router.get("/api/portfolio-items/:id/contents");

// Get the spesific content of the spesific Portfolio Item
router.get("/api/portfolio-items/:id/contents/:cid");

router.post("/api/portfolio-items/", async (req, res) => {
  res.json("Yes?");
});

// NTM : Contents can only added from the Portfolio Item *ManyToOne
router.post("/api/portfolio-items/:id/contents/");

router.put("/api/portfolio-items/:id");

// NTM : Contents can only updated from the Portfolio Item *ManyToOne
router.put("/api/portfolio-items/:id/contents/:cid");

// NTM : This also needs to delete the Contents that have
router.delete("/api/portfolio-items/:id");

export { router as portfolioItemRouter };
