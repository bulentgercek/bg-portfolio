"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subRouters = void 0;
const express_1 = __importDefault(require("express"));
const dummy_1 = require("./routers/dummy");
const assets_1 = require("./routers/assets");
const contents_1 = require("./routers/contents");
const portfolioCategories_1 = require("./routers/portfolioCategories");
const portfolioItems_1 = require("./routers/portfolioItems");
const portfolios_1 = require("./routers/portfolios");
// Router for all sub router
const router = express_1.default.Router();
/**
 * Primary router object of the server
 *
 * All routers added in /api/routers joined into an object here
 * and will iterated to use them as middelware
 */
exports.subRouters = {
    "/dummy": dummy_1.dummyRouter,
    "/assets": assets_1.assetRouter,
    "/contents": contents_1.contentRouter,
    "/portfolio-items": portfolioItems_1.portfolioItemRouter,
    "/portfolio-categories": portfolioCategories_1.portfolioCategoryRouter,
    "/portfolios": portfolios_1.portfolioRouter,
};
// Initialize all routers and join them within a router
for (const subRouter of Object.entries(exports.subRouters)) {
    router.use(subRouter[0], subRouter[1]);
}
// Api Server Root
router.get("/", (req, res) => {
    res.json({
        message: "Welcome to the BG Portfolio API Server! Output : ",
    });
});
exports.default = router;
