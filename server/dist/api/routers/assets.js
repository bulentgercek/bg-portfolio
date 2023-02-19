"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assetRouter = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const apiController_1 = require("../../apiController");
const Asset_1 = require("../../entities/Asset");
const router = (0, express_1.Router)();
exports.assetRouter = router;
// Get all assets
router.get("/", async (req, res) => {
    const validateResults = await apiController_1.ApiController.inputValidate();
    const dbAssets = await apiController_1.ApiController
        .findAll(Asset_1.Asset, validateResults, {
        relations: {
            content: true,
        },
    })
        .catch((err) => console.log(err));
    res.json(dbAssets);
});
// Get spesific asset with id
router.get("/:id", async (req, res) => {
    const ctxObj = apiController_1.ApiController.initContext({
        zInput: { params: zod_1.z.object({ id: zod_1.z.preprocess(Number, zod_1.z.number()) }) },
        reqData: { params: req.params },
    });
    const validateResults = await apiController_1.ApiController.inputValidate(ctxObj);
    const dbAsset = await apiController_1.ApiController
        .findOne(Asset_1.Asset, validateResults)
        .catch((err) => console.log(err));
    res.json(dbAsset);
});
// Add an asset
router.post("/", async (req, res) => {
    const ctxObj = apiController_1.ApiController.initContext({
        zInput: {
            body: zod_1.z.object({
                name: zod_1.z.string(),
                type: zod_1.z.nativeEnum(Asset_1.AssetType),
                url: zod_1.z.string().url(),
            }),
        },
        reqData: { body: req.body },
    });
    const validateResults = await apiController_1.ApiController.inputValidate(ctxObj);
    const addedAsset = await apiController_1.ApiController
        .add(Asset_1.Asset, validateResults)
        .catch((err) => console.log(err));
    res.json(addedAsset);
});
// Update the asset with id
router.put("/:id", async (req, res) => {
    const ctxObj = apiController_1.ApiController.initContext({
        zInput: {
            params: zod_1.z.object({ id: zod_1.z.preprocess(Number, zod_1.z.number()) }),
            body: zod_1.z.object({
                name: zod_1.z.string().optional(),
                type: zod_1.z.nativeEnum(Asset_1.AssetType).optional(),
                url: zod_1.z.string().url().optional(),
            }),
        },
        reqData: { params: req.params, body: req.body },
    });
    const validateResults = await apiController_1.ApiController.inputValidate(ctxObj);
    const updatedAsset = await apiController_1.ApiController
        .update(Asset_1.Asset, validateResults)
        .catch((err) => console.log(err));
    res.json(updatedAsset);
});
// Remove an asset with id
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
    const removedAsset = await apiController_1.ApiController
        .remove(Asset_1.Asset, validateResults)
        .catch((err) => console.log(err));
    res.json(removedAsset);
});
