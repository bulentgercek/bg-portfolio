import express from "express";
import cors from "cors";
import helmet from "helmet";
import env from "./validEnv";
import * as dummy from "./dummy";
import { serverRouters } from "./api/root";

/**
 *  Server initialization and configuration
 */
const server = express();
server.use(helmet());
server.use(cors({ origin: "http://localhost:5173" }));
server.use(express.json());
// Initialize all routers in /api/root to Express as middleware
for (const router of Object.values(serverRouters)) {
  server.use(router);
}

/**
 * Server API Routers
 */
server.get("/api/", (req, res) => {
  res.json("Welcome to the BG Portfolio API Server!");
});
// Add dummy assets
server.post("/api/dummy", async (req, res) => {
  // Cleaning all entries in tables. This is not resetting Auto Increment on ID's
  await dummy.cleanAllEntities();
  // Add dummy entries
  await dummy.addDummyPortfolio();
  await dummy.addDummyPortfolioCategories();
  await dummy.addDummyPortfolioItems();
  await dummy.addDummyAssets();
  await dummy.addDummyContent();
  await dummy.updateDummyPortfolioItems();
  res.json("It's DONE!");
});

/**
 * Server Activation
 */
server.listen(env.PORT, () => {
  console.log(`Server started and listening on port ${env.PORT}.`);
});
