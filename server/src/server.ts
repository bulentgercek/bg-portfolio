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
const corsOptions = { origin: ["http://localhost", "https://bulentgercek.com"] };
console.log("Current CORS configuration:", corsOptions); // Log the current CORS configuration

server.use(cors(corsOptions));
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
