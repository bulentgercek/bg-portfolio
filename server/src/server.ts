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
server.use(cors());
server.use(express.json());
// Initialize all routers in /api/root to Express as middleware
for (const router of Object.values(serverRouters)) {
  server.use(router);
}

/**
 * Server API Routers
 */
// Add dummy assets
server.post("/dummy", async (req, res) => {
  await dummy.deleteContents();
  await dummy.deleteAssets();
  await dummy.deletePortfolioItems();
  await dummy.deletePortfolioCategories();
  await dummy.deletePortfolio();

  await dummy.addDummyPortfolio();
  await dummy.addDummyAssets();
  await dummy.addDummyContent();
  await dummy.addDummyPortfolioItems();
  await dummy.addDummyPortfolioCategories();
  res.json("It's DONE!");
});

/**
 * Server Activation
 */
server.listen(env.PORT, () => {
  console.log(`Server started and listening on port ${env.PORT}.`);
});
