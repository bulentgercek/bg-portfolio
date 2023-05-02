import express from "express";

import { assetRouter } from "./routers/assets";
import { contentRouter } from "./routers/contents";
import { categoryRouter } from "./routers/categories";
import { itemRouter } from "./routers/items";
import { optionRouter } from "./routers/option";

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
  "/contents": contentRouter,
  "/categories": categoryRouter,
  "/items": itemRouter,
  "/options": optionRouter,
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
