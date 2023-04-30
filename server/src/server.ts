import express from "express";
import cors from "cors";
import helmet from "helmet";

import api from "./api";
import { errorHandler, noRouteFound } from "./errorHandler";

/**
 *  Server initialization and configuration
 */
const server = express();

server.use(helmet());
server.use(cors({ origin: "http://localhost" }));
server.use(express.json());

server.get("/", (req, res) => {
  res.json({
    message: "Welcome to the BG Portfolio Server ;)",
  });
});

// Api Router
server.use("/api", api);

// Next middlewares for error handling and no route found
server.use(errorHandler);
server.use(noRouteFound);

export default server;
