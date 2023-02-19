import { Router } from "express";
import { z } from "zod";
import { ApiController as ac } from "../../apiController";
import { PortfolioItem } from "../../entities/PortfolioItem";
import { Content } from "../../entities/Content";

const router = Router();

// Get all portfolio items
router.get("/", async (req, res) => {
  const validateResults = await ac.inputValidate();
  const dbPortfolioItems = await ac
    .findAll(PortfolioItem, validateResults, {
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
    })
    .catch((err) => console.log(err));

  res.json(dbPortfolioItems);
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
  const dbPortfolioItem = await ac
    .findOne(PortfolioItem, validateResults, {
      select: {
        portfolioCategory: {
          id: true,
          name: true,
        },
      },
      relations: { portfolioCategory: true, content: { asset: true } },
    })
    .catch((err) => console.log(err));

  res.json(dbPortfolioItem);
});

// Get the contents of the spesific Portfolio Item
router.get("/:id/contents", async (req, res) => {
  const ctxObj = ac.initContext({
    zInput: { params: z.object({ id: z.preprocess(Number, z.number()) }) },
    reqData: { params: req.params },
  });

  const validateResults = await ac.inputValidate(ctxObj);
  const dbContents = await ac
    .findAll(Content, validateResults, {
      where: {
        portfolioItem: {
          id: validateResults.result.params?.id,
        },
      },
      relations: {
        asset: true,
      },
    })
    .catch((err) => console.log(err));

  res.json(dbContents);
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
  const dbContent = await ac
    .findOne(Content, validateResults, {
      where: {
        id: validateResults.result.params?.cid,
        portfolioItem: {
          id: validateResults.result.params?.id,
        },
      },
      relations: {
        asset: true,
      },
    })
    .catch((err) => console.log(err));

  res.json(dbContent);
});

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
  const dbPortfolioItem = await ac
    .findOne(PortfolioItem, validateResults, {
      where: {
        id: validateResults.result.params?.id,
      },
      relations: {
        content: true,
      },
    })
    .catch((err) => console.log(err));

  if (!(dbPortfolioItem instanceof PortfolioItem))
    return res.json(
      `No portfolio item found with id ${validateResults.result.params?.id}.`,
    );

  const createdContent = await ac.add(Content, validateResults);

  if (!(createdContent instanceof Content)) return res.json(createdContent);

  dbPortfolioItem.content = [...dbPortfolioItem.content, createdContent];
  const updatedPortfolioItem = await ac
    .updateWithTarget(PortfolioItem, validateResults, dbPortfolioItem)
    .catch((err) => console.log(err));

  res.json(updatedPortfolioItem);
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
  const updatedPortfolioItem = await ac
    .update(PortfolioItem, validateResults)
    .catch((err) => console.log(err));

  res.json(updatedPortfolioItem);
});

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
  const removedPortfolioItem = await ac
    .remove(PortfolioItem, validateResults)
    .catch((err) => console.log(err));

  res.json(removedPortfolioItem);
});

export { router as portfolioItemRouter };
