"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contentRouter = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const apiController_1 = require("../../apiController");
const Asset_1 = require("../../entities/Asset");
const Content_1 = require("../../entities/Content");
const router = (0, express_1.Router)();
exports.contentRouter = router;
// Get all contents
router.get("/", async (req, res) => {
    const validateResults = await apiController_1.ApiController.inputValidate();
    const dbContents = await apiController_1.ApiController
        .findAll(Content_1.Content, validateResults, {
        select: {
            portfolioItem: {
                id: true,
            },
        },
        relations: {
            portfolioItem: true,
            asset: true,
        },
    })
        .catch((err) => console.log(err));
    res.json(dbContents);
});
// Get spesific content with id
router.get("/:id", async (req, res) => {
    const ctxObj = apiController_1.ApiController.initContext({
        zInput: { params: zod_1.z.object({ id: zod_1.z.preprocess(Number, zod_1.z.number()) }) },
        reqData: { params: req.params },
    });
    const validateResults = await apiController_1.ApiController.inputValidate(ctxObj);
    const dbContent = await apiController_1.ApiController
        .findOne(Content_1.Content, validateResults, {
        relations: {
            asset: true,
        },
    })
        .catch((err) => console.log(err));
    res.json(dbContent);
});
// Update spesific content with id
router.put("/:id", async (req, res) => {
    const ctxObj = apiController_1.ApiController.initContext({
        zInput: {
            params: zod_1.z.object({
                id: zod_1.z.preprocess(Number, zod_1.z.number()),
            }),
            body: zod_1.z.object({
                name: zod_1.z.string().optional(),
                columns: zod_1.z.number().optional(),
            }),
        },
        reqData: {
            params: req.params,
            body: req.body,
        },
    });
    const validateResults = await apiController_1.ApiController.inputValidate(ctxObj);
    const updatedContent = await apiController_1.ApiController
        .update(Content_1.Content, validateResults)
        .catch((err) => console.log(err));
    res.json(updatedContent);
});
// Assign an asset to content with ids
router.put("/:id/assets/:aid", async (req, res) => {
    var _a;
    const ctxObj = apiController_1.ApiController.initContext({
        zInput: {
            params: zod_1.z.object({
                id: zod_1.z.preprocess(Number, zod_1.z.number()),
                aid: zod_1.z.preprocess(Number, zod_1.z.number()),
            }),
        },
        reqData: {
            params: req.params,
        },
    });
    const validateResults = await apiController_1.ApiController.inputValidate(ctxObj);
    const dbContent = await apiController_1.ApiController
        .findOne(Content_1.Content, validateResults, {
        relations: {
            asset: true,
        },
    })
        .catch((err) => console.log(err));
    if (!(dbContent instanceof Content_1.Content))
        return res.json(dbContent);
    const dbAsset = await apiController_1.ApiController
        .findOne(Asset_1.Asset, validateResults, {
        where: {
            id: (_a = validateResults.result.params) === null || _a === void 0 ? void 0 : _a.aid,
        },
    })
        .catch((err) => console.log(err));
    if (!(dbAsset instanceof Asset_1.Asset))
        return res.json(dbAsset);
    dbContent.asset = [...dbContent.asset, dbAsset];
    const updatedContent = await apiController_1.ApiController
        .updateWithTarget(Content_1.Content, validateResults, dbContent)
        .catch((err) => console.log(err));
    res.json(updatedContent);
});
// Remove an asset from content with ids (Without deleting the asset from the db)
router.delete("/:id/assets/:aid", async (req, res) => {
    var _a;
    const ctxObj = apiController_1.ApiController.initContext({
        zInput: {
            params: zod_1.z.object({
                id: zod_1.z.preprocess(Number, zod_1.z.number()),
                aid: zod_1.z.preprocess(Number, zod_1.z.number()),
            }),
        },
        reqData: {
            params: req.params,
        },
    });
    const validateResults = await apiController_1.ApiController.inputValidate(ctxObj);
    const dbContent = await apiController_1.ApiController
        .findOne(Content_1.Content, validateResults, {
        relations: {
            asset: true,
        },
    })
        .catch((err) => console.log(err));
    if (!(dbContent instanceof Content_1.Content))
        return res.json(dbContent);
    const dbAsset = await apiController_1.ApiController
        .findOne(Asset_1.Asset, validateResults, {
        where: {
            id: (_a = validateResults.result.params) === null || _a === void 0 ? void 0 : _a.aid,
        },
    })
        .catch((err) => console.log(err));
    if (!(dbAsset instanceof Asset_1.Asset))
        return res.json(dbAsset);
    dbContent.asset = dbContent.asset.filter((asset) => asset.id !== dbAsset.id);
    const updatedContent = await apiController_1.ApiController
        .updateWithTarget(Content_1.Content, validateResults, dbContent)
        .catch((err) => console.log(err));
    res.json(updatedContent);
});
// Delete spesific Content with id
router.delete("/:id", async (req, res) => {
    const ctxObj = apiController_1.ApiController.initContext({
        zInput: {
            params: zod_1.z.object({ id: zod_1.z.preprocess(Number, zod_1.z.number()) }),
        },
        reqData: { params: req.params },
    });
    const validateResults = await apiController_1.ApiController.inputValidate(ctxObj);
    const removedContent = await apiController_1.ApiController
        .remove(Content_1.Content, validateResults)
        .catch((err) => console.log(err));
    res.json(removedContent);
});
// /**
//  * Archive Codes
//  */
// // // Get all contents - With filtering after the query - total manuplation!
// // router.get("/api/contents-wf/", async (req, res) => {
// //   await dsm
// //     .find(Content, {
// //       relations: {
// //         asset: true,
// //       },
// //     })
// //     .then((data) => {
// //       const filteredData = data.map((contents) => ({
// //         ...contents,
// //         asset: contents.asset.map((asset) => ({
// //           name: asset.name,
// //         })),
// //       }));
// //       res.json(filteredData);
// //     });
// // });
// // // Get all contents - with the querybuilder
// // router.get("/api/contents-wqb/", async (req, res) => {
// //   await dsm
// //     .createQueryBuilder(Content, "contents")
// //     .leftJoinAndSelect("contents.asset", "asset")
// //     .select(["contents.id", "contents.columns", "asset.name"])
// //     .getMany()
// //     .then((data) => res.json(data))
// //     .catch((e) => console.log(e));
// // });
