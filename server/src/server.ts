import express from "express";
import cors from "cors";
import helmet from "helmet";

import api from "./api";
import { noRouteFound } from "./errorHandler";

/**
 *  Server initialization and configuration
 */
const server = express();

server.use(helmet());
server.use(cors({ origin: "http://localhost:5173" }));
server.use(express.json());

server.get("/", (req, res) => {
  res.json({
    message: "Welcome to the BG Portfolio Server",
  });
});

// Api Router
server.use("/api", api);

// Next router for error handling
server.use(noRouteFound);

export default server;
