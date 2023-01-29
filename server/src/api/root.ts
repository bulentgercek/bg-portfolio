import { assetRouter } from "./routers/assets";
import { contentRouter } from "./routers/contents";
import { portfolioCategoryRouter } from "./routers/portfolioCategories";
import { portfolioItemRouter } from "./routers/portfolioItems";
import { portfolioRouter } from "./routers/portfolios";

/**
 * Primary router of the server
 *
 * All routers added in /api/routers should be manually added here
 */
export const serverRouters = {
  assetRouter,
  contentRouter,
  portfolioItemRouter,
  portfolioCategoryRouter,
  portfolioRouter,
};
