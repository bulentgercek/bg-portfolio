import { Router } from "express";
import { z } from "zod";
import { ApiController as ac } from "../../apiController";
import { Portfolio } from "../../entities/Portfolio";
import { PortfolioCategory } from "../../entities/PortfolioCategory";
import { PortfolioItem } from "../../entities/PortfolioItem";

const router = Router();

// Get all Portfolios
router.get("/", async (req, res) => {
  const validateResults = await ac.inputValidate();
  const dbPortfolios = await ac
    .findAll(Portfolio, validateResults, {
      relations: {
        portfolioCategory: true,
        portfolioItem: {
          content: true,
        },
      },
    })
    .catch((err) => console.log(err));

  res.json(dbPortfolios);
});

// Get spesific portfolio with id
router.get("/:id", async (req, res) => {
  const ctxObj = ac.initContext({
    zInput: { params: z.object({ id: z.preprocess(Number, z.number()) }) },
    reqData: { params: req.params },
  });

  const validateResults = await ac.inputValidate(ctxObj);
  const dbPortfolio = await ac
    .findOne(Portfolio, validateResults, {
      where: {
        id: validateResults.result.params?.id,
      },
      relations: {
        portfolioCategory: true,
        portfolioItem: {
          content: true,
        },
      },
    })
    .catch((err) => console.log(err));

  res.json(dbPortfolio);
});

// Add a portfolio category to the spesific portfolio with id
router.post("/:id/portfolio-categories", async (req, res) => {
  const ctxObj = ac.initContext({
    zInput: {
      params: z.object({ id: z.preprocess(Number, z.number()) }),
      body: z.object({
        name: z.string(),
        itemsOrder: z.string().nullable(),
      }),
    },
    reqData: { params: req.params, body: req.body },
  });

  const validateResults = await ac.inputValidate(ctxObj);
  // Get the portfolio
  const dbPortfolio = await ac
    .findOne(Portfolio, validateResults, {
      relations: {
        portfolioCategory: true,
      },
    })
    .catch((err) => console.log(err));

  if (!(dbPortfolio instanceof Portfolio)) return res.json(dbPortfolio);

  const addedPortfolioCategory = await ac
    .add(PortfolioCategory, validateResults)
    .catch((err) => {
      console.log(err);
    })
    .catch((err) => console.log(err));

  if (!(addedPortfolioCategory instanceof PortfolioCategory))
    return res.json(addedPortfolioCategory);

  dbPortfolio.portfolioCategory = [
    ...dbPortfolio.portfolioCategory,
    addedPortfolioCategory,
  ];

  const updatedPortfolio = await ac
    .updateRelation(Portfolio, validateResults, dbPortfolio)
    .catch((err) => console.log(err));

  res.json(updatedPortfolio);
});

// Add a Portfolio Item to the spesific portfolio with id
router.post("/:id/portfolio-items", async (req, res) => {
  const ctxObj = ac.initContext({
    zInput: {
      params: z.object({
        id: z.preprocess(Number, z.number()),
      }),
      body: z.object({
        name: z.string(),
        description: z.string(),
        link: z.string().url(),
      }),
    },
    reqData: { params: req.params, body: req.body },
  });

  const validateResults = await ac.inputValidate(ctxObj);
  // Call the Portfolio with portfolioId from req.params
  const dbPortfolio = await ac
    .findOne(Portfolio, validateResults, {
      relations: {
        portfolioItem: true,
      },
    })
    .catch((err) => console.log(err));

  if (!(dbPortfolio instanceof Portfolio)) return res.json(dbPortfolio);

  const addedPortfolioItem = await ac
    .add(PortfolioItem, validateResults)
    .catch((err) => console.log(err));

  if (!(addedPortfolioItem instanceof PortfolioItem))
    return res.json(addedPortfolioItem);

  dbPortfolio.portfolioItem = [
    ...dbPortfolio.portfolioItem,
    addedPortfolioItem,
  ];

  const updatedPortfolio = await ac
    .updateRelation(Portfolio, validateResults, dbPortfolio)
    .catch((err) => console.log(err));

  res.json(updatedPortfolio);
});

export { router as portfolioRouter };
