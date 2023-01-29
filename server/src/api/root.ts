import { assetRouter } from "./routers/assets";
import { contentRouter } from "./routers/contents";
import { portfolioCategoryRouter } from "./routers/portfolioCategories";
import { portfolioItemRouter } from "./routers/portfolioItems";
import { portfolioRouter } from "./routers/portfolios";

/**
 * Primary router object of the server
 *
 * All routers added in /api/routers joined into an object here
 * and will iterated in server.ts to use them as middelware
 */
export const serverRouters = {
  assetRouter,
  contentRouter,
  portfolioItemRouter,
  portfolioCategoryRouter,
  portfolioRouter,
};
