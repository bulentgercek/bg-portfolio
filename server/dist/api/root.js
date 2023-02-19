"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverRouters = void 0;
const assets_1 = require("./routers/assets");
const contents_1 = require("./routers/contents");
const portfolioCategories_1 = require("./routers/portfolioCategories");
const portfolioItems_1 = require("./routers/portfolioItems");
const portfolios_1 = require("./routers/portfolios");
/**
 * Primary router object of the server
 *
 * All routers added in /api/routers joined into an object here
 * and will iterated in server.ts to use them as middelware
 */
exports.serverRouters = {
    assetRouter: assets_1.assetRouter,
    contentRouter: contents_1.contentRouter,
    portfolioItemRouter: portfolioItems_1.portfolioItemRouter,
    portfolioCategoryRouter: portfolioCategories_1.portfolioCategoryRouter,
    portfolioRouter: portfolios_1.portfolioRouter,
};
