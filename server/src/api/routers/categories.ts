import { Router } from "express";
import { z } from "zod";
import { ApiController as ac } from "../../apiController";
import { Category } from "../../entities/Category";

const router = Router();

// Get Category Sitemap
router.get("/sitemap", async (req, res) => {
  // Root Categories : Categories with no parentCategories
});

// Get all Categories
router.get("/", async (req, res) => {
  const validateResults = await ac.inputValidate();
  const dbCategories = await ac
    .findAll(Category, validateResults, {
      relations: {
        parentCategories: true,
        items: {
          contents: true,
        },
      },
    })
    .catch((err) => console.log(err));

  res.json(dbCategories);
});

// Get spesific category with id
router.get("/:id", async (req, res) => {
  const ctxObj = ac.initContext({
    zInput: { params: z.object({ id: z.preprocess(Number, z.number()) }) },
    reqData: { params: req.params },
  });

  const validateResults = await ac.inputValidate(ctxObj);
  const dbCategory = await ac
    .findOne(Category, validateResults, {
      where: {
        id: validateResults.result.params?.id,
      },
      relations: {
        parentCategories: true,
        items: {
          contents: true,
        },
      },
    })
    .catch((err) => console.log(err));

  res.json(dbCategory);
});

// Add a Category
router.post("/", async (req, res) => {
  const ctxObj = ac.initContext({
    zInput: {
      body: z.object({
        name: z.string(),
        description: z.string().nullable().optional(),
        childCategoriesOrder: z.string().nullable().optional(),
        itemsOrder: z.string().nullable().optional(),
      }),
    },
    reqData: { body: req.body },
  });

  const validateResults = await ac.inputValidate(ctxObj);
  const addedCategory = await ac
    .addWithCreate(Category, validateResults)
    .catch((err) => console.log(err));

  res.json(addedCategory);
});

// // Get spesific portfolio category with id
// router.get("/:id", async (req, res) => {
//   const ctxObj = ac.initContext({
//     zInput: {
//       params: z.object({
//         id: z.preprocess(Number, z.number()),
//       }),
//     },
//     reqData: {
//       params: req.params,
//     },
//   });

//   const validateResults = await ac.inputValidate(ctxObj);
//   const dbPortfolioCategory = await ac.findOne(
//     PortfolioCategory,
//     validateResults,
//     {
//       relations: {
//         portfolio: true,
//         portfolioItem: true,
//       },
//     },
//   );

//   res.json(dbPortfolioCategory);
// });

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
  const removedPortfolioCategory = await ac.remove(Category, validateResults);

  res.json(removedPortfolioCategory);
});

export { router as categoryRouter };
