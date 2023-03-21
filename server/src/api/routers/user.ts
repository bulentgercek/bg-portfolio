// import { Router } from "express";
// import { z } from "zod";
// import { ApiController as ac } from "../../apiController";
// import { User } from "../../entities/User";
// import { PortfolioCategory } from "../../entities/Category";
// import { PortfolioItem } from "../../entities/Item";

// const router = Router();

// // Get all Portfolios
// router.get("/", async (req, res) => {
//   const validateResults = await ac.inputValidate();
//   const dbPortfolios = await ac
//     .findAll(Portfolio, validateResults, {
//       relations: {
//         portfolioCategory: true,
//         portfolioItem: {
//           content: true,
//         },
//       },
//     })
//     .catch((err) => console.log(err));

//   res.json(dbPortfolios);
// });

// // Get spesific portfolio with id
// router.get("/:id", async (req, res) => {
//   const ctxObj = ac.initContext({
//     zInput: { params: z.object({ id: z.preprocess(Number, z.number()) }) },
//     reqData: { params: req.params },
//   });

//   const validateResults = await ac.inputValidate(ctxObj);
//   const dbPortfolio = await ac
//     .findOne(Portfolio, validateResults, {
//       where: {
//         id: validateResults.result.params?.id,
//       },
//       relations: {
//         portfolioCategory: true,
//         portfolioItem: {
//           content: true,
//         },
//       },
//     })
//     .catch((err) => console.log(err));

//   res.json(dbPortfolio);
// });

// // Add a Portfolio
// router.post("/", async (req, res) => {
//   const ctxObj = ac.initContext({
//     zInput: {
//       body: z.object({
//         name: z.string(),
//         categoriesOrder: z.string().nullable(),
//         itemsOrder: z.string().nullable(),
//       }),
//     },
//     reqData: { body: req.body },
//   });

//   const validateResults = await ac.inputValidate(ctxObj);
//   const addedPortfolio = await ac
//     .addWithCreate(Portfolio, validateResults)
//     .catch((err) => console.log(err));

//   res.json(addedPortfolio);
// });

// // Add a Portfolio Category to the spesific Portfolio with id
// router.post("/:id/portfolio-categories", async (req, res) => {
//   const ctxObj = ac.initContext({
//     zInput: {
//       params: z.object({ id: z.preprocess(Number, z.number()) }),
//       body: z.object({
//         name: z.string(),
//         itemsOrder: z.string().nullable(),
//       }),
//     },
//     reqData: { params: req.params, body: req.body },
//   });

//   const validateResults = await ac.inputValidate(ctxObj);
//   // Get the portfolio
//   const dbPortfolio = await ac
//     .findOne(Portfolio, validateResults, {
//       relations: {
//         portfolioCategory: true,
//       },
//     })
//     .catch((err) => console.log(err));

//   if (!(dbPortfolio instanceof Portfolio)) return res.json(dbPortfolio);

//   const addedPortfolioCategory = await ac
//     .addWithCreate(PortfolioCategory, validateResults)
//     .catch((err) => {
//       console.log(err);
//     })
//     .catch((err) => console.log(err));

//   if (!(addedPortfolioCategory instanceof PortfolioCategory))
//     return res.json(addedPortfolioCategory);

//   dbPortfolio.portfolioCategory = [
//     ...dbPortfolio.portfolioCategory,
//     addedPortfolioCategory,
//   ];

//   const updatedPortfolio = await ac
//     .updateWithTarget(Portfolio, validateResults, dbPortfolio)
//     .catch((err) => console.log(err));

//   res.json(updatedPortfolio);
// });

// // Add a Portfolio Item to the spesific Portfolio with id
// router.post("/:id/portfolio-items", async (req, res) => {
//   const ctxObj = ac.initContext({
//     zInput: {
//       params: z.object({
//         id: z.preprocess(Number, z.number()),
//       }),
//       body: z.object({
//         name: z.string(),
//         description: z.string(),
//         link: z.string().url(),
//       }),
//     },
//     reqData: { params: req.params, body: req.body },
//   });

//   const validateResults = await ac.inputValidate(ctxObj);
//   const dbPortfolio = await ac
//     .findOne(Portfolio, validateResults, {
//       relations: {
//         portfolioItem: true,
//       },
//     })
//     .catch((err) => console.log(err));

//   if (!(dbPortfolio instanceof Portfolio)) return res.json(dbPortfolio);

//   const addedPortfolioItem = ac.create(
//     PortfolioItem,
//     validateResults.result.body,
//   );

//   if (!(addedPortfolioItem instanceof PortfolioItem))
//     return res.json(addedPortfolioItem);

//   dbPortfolio.portfolioItem = [
//     ...dbPortfolio.portfolioItem,
//     addedPortfolioItem,
//   ];

//   const updatedPortfolio = await ac
//     .updateWithTarget(Portfolio, validateResults, dbPortfolio)
//     .catch((err) => console.log(err));

//   res.json(updatedPortfolio);
// });

// // Delete Portfolio with id (and all its PCategories and PItems and their Contents)
// router.delete("/:id", async (req, res) => {
//   const ctxObj = ac.initContext({
//     zInput: {
//       params: z.object({
//         id: z.preprocess(Number, z.number()),
//       }),
//     },
//     reqData: { params: req.params },
//   });

//   const validateResults = await ac.inputValidate(ctxObj);
//   const deletedPortfolio = await ac.remove(Portfolio, validateResults);

//   res.json(deletedPortfolio);
// });

// export { router as portfolioRouter };
