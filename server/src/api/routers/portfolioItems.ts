import { Router } from "express";
import { z } from "zod";
import { ApiController as ac } from "../../apiController";
import { PortfolioItem } from "../../entities/PortfolioItem";
import { Content } from "../../entities/Content";
import { Asset } from "../../entities/Asset";
import { dsm } from "../../connections";
import { Portfolio } from "../../entities/Portfolio";

const router = Router();

// Get all portfolio items
router.get("/", async (req, res) => {
  // We dont have any validation, so initializing true
  const validateResults = await ac.inputValidate();
  const dbResults = await ac.findAll(PortfolioItem, validateResults, {
    select: {
      portfolioCategory: {
        id: true,
        name: true,
      },
      portfolio: {
        id: true,
        name: true,
      },
    },
    relations: {
      portfolioCategory: true,
      content: {
        asset: true,
      },
      portfolio: true,
    },
  });

  res.json(dbResults);
});

// Get spesific portfolio item
router.get("/:id", async (req, res) => {
  const ctxObj = ac.initContext({
    zInput: {
      params: z.object({ id: z.preprocess(Number, z.number()) }),
    },
    reqData: {
      params: req.params,
    },
  });

  const validateResults = await ac.inputValidate(ctxObj);
  const dbResults = await ac.findOne(PortfolioItem, validateResults, {
    select: {
      portfolioCategory: {
        id: true,
        name: true,
      },
    },
    relations: { portfolioCategory: true, content: { asset: true } },
  });

  res.json(dbResults);
});

// Get the contents of the spesific Portfolio Item
router.get("/:id/contents", async (req, res) => {
  const ctxObj = ac.initContext({
    zInput: { params: z.object({ id: z.preprocess(Number, z.number()) }) },
    reqData: { params: req.params },
  });

  const validateResults = await ac.inputValidate(ctxObj);
  const dbResult = await ac.findAll(Content, validateResults, {
    where: {
      portfolioItem: {
        id: validateResults.result.params?.id,
      },
    },
    relations: {
      asset: true,
    },
  });

  res.json(dbResult);
});

// Get the spesific content of the spesific Portfolio Item
router.get("/:id/contents/:cid", async (req, res) => {
  const ctxObj = ac.initContext({
    zInput: {
      params: z.object({
        id: z.preprocess(Number, z.number()),
        cid: z.preprocess(Number, z.number()),
      }),
    },
    reqData: { params: req.params },
  });

  const validateResults = await ac.inputValidate(ctxObj);
  const dbResult = await ac.findOne(Content, validateResults, {
    where: {
      id: validateResults.result.params?.cid,
      portfolioItem: {
        id: validateResults.result.params?.id,
      },
    },
    relations: {
      asset: true,
    },
  });

  res.json(dbResult);
});

// Add a Portfolio Item
router.post("/:portfolioId", async (req, res) => {
  const ctxObj = ac.initContext({
    zInput: {
      params: z.object({
        portfolioId: z.preprocess(Number, z.number()),
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
  const portfolio = await ac.findOne(Portfolio, validateResults, {
    where: {
      id: validateResults.result.params?.portfolioId,
    },
    relations: {
      portfolioItem: true,
    },
  });
  // Check the Portfolio if not return validateResults
  if (!(portfolio instanceof Portfolio)) res.json(portfolio);

  // Add Portfolio Item
  const dbResult_portfolioItem = await ac.add(PortfolioItem, validateResults);

  // Update Portfolio by adding the new Portfolio Item
  portfolio.portfolioItem = [
    ...portfolio.portfolioItem,
    dbResult_portfolioItem as PortfolioItem,
  ];

  const dbResult_portfolio = await ac.update(
    Portfolio,
    validateResults,
    portfolio,
  );

  res.json(dbResult_portfolio);
});

// NTM : Contents can only added from the Portfolio Item *ManyToOne
// Add Content to a spesific Portfolio Item
router.post("/:id/contents", async (req, res) => {
  const ctxObj = ac.initContext({
    zInput: {
      params: z.object({
        id: z.preprocess(Number, z.number()),
      }),
      body: z.object({
        name: z.string(),
        columns: z.number(),
      }),
    },
    reqData: { params: req.params, body: req.body },
  });

  const validateResults = await ac.inputValidate(ctxObj);
  const portfolioItem = await ac.findOne(PortfolioItem, validateResults, {
    where: {
      id: validateResults.result.params?.id,
    },
    relations: {
      content: true,
    },
  });

  if (portfolioItem === null)
    return res.json(
      `No portfolio item found with id ${validateResults.result.params?.id}.`,
    );

  const dbResult_content = await ac.add(Content, validateResults);
  if (!(dbResult_content instanceof Content)) res.json(dbResult_content);

  portfolioItem.content = [
    ...portfolioItem.content,
    dbResult_content as Content,
  ];
  const dbResult_portfolioItem = await ac.updateRelation(
    PortfolioItem,
    validateResults,
    portfolioItem,
  );

  res.json(dbResult_portfolioItem);
});

// Update a Portfolio Item
router.put("/:id", async (req, res) => {
  const ctxObj = ac.initContext({
    zInput: {
      params: z.object({
        id: z.preprocess(Number, z.number()),
      }),
      body: z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        link: z.string().optional(),
      }),
    },
    reqData: {
      params: req.params,
      body: req.body,
    },
  });

  const validateResults = await ac.inputValidate(ctxObj);
  const dbResult = await ac.update(PortfolioItem, validateResults);
  res.json(dbResult);
});

// NTM : Contents can only updated from the Portfolio Item *ManyToOne
router.put("/:id/contents/:cid");

// NTM : This also needs to delete the Contents that have
// Delete Portfolio Item
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
  const portfolioItem = await ac.findOne(PortfolioItem, validateResults, {
    where: {
      id: validateResults.result.params?.id,
    },
  });

  // const removeContents = await ac.remove(Content, val)
  // const dbResult = await ac.remove(PortfolioItem, validateResults);
  res.json(portfolioItem);
});

export { router as portfolioItemRouter };
