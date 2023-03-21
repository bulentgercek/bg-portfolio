import express, { NextFunction } from "express";
// import { dummyRouter } from "./routers/dummy";
import { assetRouter } from "./routers/assets";
import { contentRouter } from "./routers/contents";
import { categoryRouter } from "./routers/categories";
import { itemRouter } from "./routers/items";
// import { portfolioRouter } from "./routers/user";

// Router for all sub router
const router = express.Router();

/**
 * Primary router object of the server
 *
 * All routers added in /api/routers joined into an object here
 * and will iterated to use them as middelware
 */
export const subRouters = {
  "/assets": assetRouter,
  // "/dummy": dummyRouter,
  "/contents": contentRouter,
  "/categories": categoryRouter,
  "/items": itemRouter,
  // "/portfolios": portfolioRouter,
};

// Initialize all routers and join them within a router
for (const subRouter of Object.entries(subRouters)) {
  router.use(subRouter[0], subRouter[1]);
}

// Api Server Root
router.get("/", (req, res) => {
  res.json({
    message: "Welcome to the BG Portfolio API Server!",
  });
});

export default router;
