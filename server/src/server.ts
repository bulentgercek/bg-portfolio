import express from "express";
import cors from "cors";
import helmet from "helmet";
import env from "./validEnv";
import { dsConnection } from "./connections";
import * as queries from "./queries";

/**
 *  Server initialization and configuration
 */
const server = express();
server.use(helmet());
server.use(cors());
server.use(express.json());

/**
 * TypeORM initialization and configuration
 */
const ds = dsConnection(env.DATABASE_URL);

/**
 * Server API Routers
 */
// Get all users
server.get("/", (req, res) => {
  queries.getUsers(ds).then((data) => res.json(data));
});

/**
 * Server Activation
 */
server.listen(env.PORT, () => {
  console.log(`Server started and listening on port ${env.PORT}.`);
});
