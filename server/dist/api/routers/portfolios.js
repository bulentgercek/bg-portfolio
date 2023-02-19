"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.portfolioRouter = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const apiController_1 = require("../../apiController");
const Portfolio_1 = require("../../entities/Portfolio");
const PortfolioCategory_1 = require("../../entities/PortfolioCategory");
const PortfolioItem_1 = require("../../entities/PortfolioItem");
const router = (0, express_1.Router)();
exports.portfolioRouter = router;
// Get all Portfolios
router.get("/", async (req, res) => {
    const validateResults = await apiController_1.ApiController.inputValidate();
    const dbPortfolios = await apiController_1.ApiController
        .findAll(Portfolio_1.Portfolio, validateResults, {
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
    var _a;
    const ctxObj = apiController_1.ApiController.initContext({
        zInput: { params: zod_1.z.object({ id: zod_1.z.preprocess(Number, zod_1.z.number()) }) },
        reqData: { params: req.params },
    });
    const validateResults = await apiController_1.ApiController.inputValidate(ctxObj);
    const dbPortfolio = await apiController_1.ApiController
        .findOne(Portfolio_1.Portfolio, validateResults, {
        where: {
            id: (_a = validateResults.result.params) === null || _a === void 0 ? void 0 : _a.id,
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
// Add a Portfolio
router.post("/", async (req, res) => {
    const ctxObj = apiController_1.ApiController.initContext({
        zInput: {
            body: zod_1.z.object({
                name: zod_1.z.string(),
                categoriesOrder: zod_1.z.string().nullable(),
                itemsOrder: zod_1.z.string().nullable(),
            }),
        },
        reqData: { body: req.body },
    });
    const validateResults = await apiController_1.ApiController.inputValidate(ctxObj);
    const addedPortfolio = await apiController_1.ApiController
        .add(Portfolio_1.Portfolio, validateResults)
        .catch((err) => console.log(err));
    res.json(addedPortfolio);
});
// Add a Portfolio Category to the spesific Portfolio with id
router.post("/:id/portfolio-categories", async (req, res) => {
    const ctxObj = apiController_1.ApiController.initContext({
        zInput: {
            params: zod_1.z.object({ id: zod_1.z.preprocess(Number, zod_1.z.number()) }),
            body: zod_1.z.object({
                name: zod_1.z.string(),
                itemsOrder: zod_1.z.string().nullable(),
            }),
        },
        reqData: { params: req.params, body: req.body },
    });
    const validateResults = await apiController_1.ApiController.inputValidate(ctxObj);
    // Get the portfolio
    const dbPortfolio = await apiController_1.ApiController
        .findOne(Portfolio_1.Portfolio, validateResults, {
        relations: {
            portfolioCategory: true,
        },
    })
        .catch((err) => console.log(err));
    if (!(dbPortfolio instanceof Portfolio_1.Portfolio))
        return res.json(dbPortfolio);
    const addedPortfolioCategory = await apiController_1.ApiController
        .add(PortfolioCategory_1.PortfolioCategory, validateResults)
        .catch((err) => {
        console.log(err);
    })
        .catch((err) => console.log(err));
    if (!(addedPortfolioCategory instanceof PortfolioCategory_1.PortfolioCategory))
        return res.json(addedPortfolioCategory);
    dbPortfolio.portfolioCategory = [
        ...dbPortfolio.portfolioCategory,
        addedPortfolioCategory,
    ];
    const updatedPortfolio = await apiController_1.ApiController
        .updateWithTarget(Portfolio_1.Portfolio, validateResults, dbPortfolio)
        .catch((err) => console.log(err));
    res.json(updatedPortfolio);
});
// Add a Portfolio Item to the spesific Portfolio with id
router.post("/:id/portfolio-items", async (req, res) => {
    const ctxObj = apiController_1.ApiController.initContext({
        zInput: {
            params: zod_1.z.object({
                id: zod_1.z.preprocess(Number, zod_1.z.number()),
            }),
            body: zod_1.z.object({
                name: zod_1.z.string(),
                description: zod_1.z.string(),
                link: zod_1.z.string().url(),
            }),
        },
        reqData: { params: req.params, body: req.body },
    });
    const validateResults = await apiController_1.ApiController.inputValidate(ctxObj);
    const dbPortfolio = await apiController_1.ApiController
        .findOne(Portfolio_1.Portfolio, validateResults, {
        relations: {
            portfolioItem: true,
        },
    })
        .catch((err) => console.log(err));
    if (!(dbPortfolio instanceof Portfolio_1.Portfolio))
        return res.json(dbPortfolio);
    const addedPortfolioItem = apiController_1.ApiController.create(PortfolioItem_1.PortfolioItem, validateResults.result.body);
    if (!(addedPortfolioItem instanceof PortfolioItem_1.PortfolioItem))
        return res.json(addedPortfolioItem);
    dbPortfolio.portfolioItem = [
        ...dbPortfolio.portfolioItem,
        addedPortfolioItem,
    ];
    const updatedPortfolio = await apiController_1.ApiController
        .updateWithTarget(Portfolio_1.Portfolio, validateResults, dbPortfolio)
        .catch((err) => console.log(err));
    res.json(updatedPortfolio);
});
// Delete Portfolio with id (and all its PCategories and PItems and their Contents)
router.delete("/:id", async (req, res) => {
    const ctxObj = apiController_1.ApiController.initContext({
        zInput: {
            params: zod_1.z.object({
                id: zod_1.z.preprocess(Number, zod_1.z.number()),
            }),
        },
        reqData: { params: req.params },
    });
    const validateResults = await apiController_1.ApiController.inputValidate(ctxObj);
    const deletedPortfolio = await apiController_1.ApiController.remove(Portfolio_1.Portfolio, validateResults);
    res.json(deletedPortfolio);
});
