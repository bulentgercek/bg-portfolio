"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.portfolioCategoryRouter = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const apiController_1 = require("../../apiController");
const PortfolioCategory_1 = require("../../entities/PortfolioCategory");
const router = (0, express_1.Router)();
exports.portfolioCategoryRouter = router;
// Get all portfolio categories
router.get("/", async (req, res) => {
    const validateResults = await apiController_1.ApiController.inputValidate();
    const dbPortfolioCategories = await apiController_1.ApiController.findAll(PortfolioCategory_1.PortfolioCategory, validateResults, {
        select: {
            portfolio: {
                id: true,
                name: true,
            },
        },
        relations: {
            portfolio: true,
        },
    });
    res.json(dbPortfolioCategories);
});
// Get spesific portfolio category with id
router.get("/:id", async (req, res) => {
    const ctxObj = apiController_1.ApiController.initContext({
        zInput: {
            params: zod_1.z.object({
                id: zod_1.z.preprocess(Number, zod_1.z.number()),
            }),
        },
        reqData: {
            params: req.params,
        },
    });
    const validateResults = await apiController_1.ApiController.inputValidate(ctxObj);
    const dbPortfolioCategory = await apiController_1.ApiController.findOne(PortfolioCategory_1.PortfolioCategory, validateResults, {
        relations: {
            portfolio: true,
            portfolioItem: true,
        },
    });
    res.json(dbPortfolioCategory);
});
// Delete spesific portfolio category with id
router.delete("/:id", async (req, res) => {
    const ctxObj = apiController_1.ApiController.initContext({
        zInput: {
            params: zod_1.z.object({
                id: zod_1.z.preprocess(Number, zod_1.z.number()),
            }),
        },
        reqData: {
            params: req.params,
        },
    });
    const validateResults = await apiController_1.ApiController.inputValidate(ctxObj);
    const removedPortfolioCategory = await apiController_1.ApiController.remove(PortfolioCategory_1.PortfolioCategory, validateResults);
    res.json(removedPortfolioCategory);
});
