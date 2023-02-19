"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.portfolioItemRouter = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const apiController_1 = require("../../apiController");
const PortfolioItem_1 = require("../../entities/PortfolioItem");
const Content_1 = require("../../entities/Content");
const router = (0, express_1.Router)();
exports.portfolioItemRouter = router;
// Get all portfolio items
router.get("/", async (req, res) => {
    const validateResults = await apiController_1.ApiController.inputValidate();
    const dbPortfolioItems = await apiController_1.ApiController
        .findAll(PortfolioItem_1.PortfolioItem, validateResults, {
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
    const ctxObj = apiController_1.ApiController.initContext({
        zInput: {
            params: zod_1.z.object({ id: zod_1.z.preprocess(Number, zod_1.z.number()) }),
        },
        reqData: {
            params: req.params,
        },
    });
    const validateResults = await apiController_1.ApiController.inputValidate(ctxObj);
    const dbPortfolioItem = await apiController_1.ApiController
        .findOne(PortfolioItem_1.PortfolioItem, validateResults, {
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
    var _a;
    const ctxObj = apiController_1.ApiController.initContext({
        zInput: { params: zod_1.z.object({ id: zod_1.z.preprocess(Number, zod_1.z.number()) }) },
        reqData: { params: req.params },
    });
    const validateResults = await apiController_1.ApiController.inputValidate(ctxObj);
    const dbContents = await apiController_1.ApiController
        .findAll(Content_1.Content, validateResults, {
        where: {
            portfolioItem: {
                id: (_a = validateResults.result.params) === null || _a === void 0 ? void 0 : _a.id,
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
    var _a, _b;
    const ctxObj = apiController_1.ApiController.initContext({
        zInput: {
            params: zod_1.z.object({
                id: zod_1.z.preprocess(Number, zod_1.z.number()),
                cid: zod_1.z.preprocess(Number, zod_1.z.number()),
            }),
        },
        reqData: { params: req.params },
    });
    const validateResults = await apiController_1.ApiController.inputValidate(ctxObj);
    const dbContent = await apiController_1.ApiController
        .findOne(Content_1.Content, validateResults, {
        where: {
            id: (_a = validateResults.result.params) === null || _a === void 0 ? void 0 : _a.cid,
            portfolioItem: {
                id: (_b = validateResults.result.params) === null || _b === void 0 ? void 0 : _b.id,
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
    var _a, _b;
    const ctxObj = apiController_1.ApiController.initContext({
        zInput: {
            params: zod_1.z.object({
                id: zod_1.z.preprocess(Number, zod_1.z.number()),
            }),
            body: zod_1.z.object({
                name: zod_1.z.string(),
                columns: zod_1.z.number(),
            }),
        },
        reqData: { params: req.params, body: req.body },
    });
    const validateResults = await apiController_1.ApiController.inputValidate(ctxObj);
    const dbPortfolioItem = await apiController_1.ApiController
        .findOne(PortfolioItem_1.PortfolioItem, validateResults, {
        where: {
            id: (_a = validateResults.result.params) === null || _a === void 0 ? void 0 : _a.id,
        },
        relations: {
            content: true,
        },
    })
        .catch((err) => console.log(err));
    if (!(dbPortfolioItem instanceof PortfolioItem_1.PortfolioItem))
        return res.json(`No portfolio item found with id ${(_b = validateResults.result.params) === null || _b === void 0 ? void 0 : _b.id}.`);
    const createdContent = await apiController_1.ApiController.add(Content_1.Content, validateResults);
    if (!(createdContent instanceof Content_1.Content))
        return res.json(createdContent);
    dbPortfolioItem.content = [...dbPortfolioItem.content, createdContent];
    const updatedPortfolioItem = await apiController_1.ApiController
        .updateWithTarget(PortfolioItem_1.PortfolioItem, validateResults, dbPortfolioItem)
        .catch((err) => console.log(err));
    res.json(updatedPortfolioItem);
});
// Update a Portfolio Item
router.put("/:id", async (req, res) => {
    const ctxObj = apiController_1.ApiController.initContext({
        zInput: {
            params: zod_1.z.object({
                id: zod_1.z.preprocess(Number, zod_1.z.number()),
            }),
            body: zod_1.z.object({
                name: zod_1.z.string().optional(),
                description: zod_1.z.string().optional(),
                link: zod_1.z.string().optional(),
            }),
        },
        reqData: {
            params: req.params,
            body: req.body,
        },
    });
    const validateResults = await apiController_1.ApiController.inputValidate(ctxObj);
    const updatedPortfolioItem = await apiController_1.ApiController
        .update(PortfolioItem_1.PortfolioItem, validateResults)
        .catch((err) => console.log(err));
    res.json(updatedPortfolioItem);
});
// Delete Portfolio Item
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
    const removedPortfolioItem = await apiController_1.ApiController
        .remove(PortfolioItem_1.PortfolioItem, validateResults)
        .catch((err) => console.log(err));
    res.json(removedPortfolioItem);
});
