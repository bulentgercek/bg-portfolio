import express from "express";
import cors from "cors";
import helmet from "helmet";

import api from "./api";
import { errorHandler, noRouteFound } from "./errorHandler";
import path from "path";

/**
 *  Server initialization and configuration
 */
const server = express();

server.use(helmet());

// Define CORS options based on the environment
const corsOptions =
  process.env.NODE_ENV === "production" ? { origin: "https://bulentgercek.com" } : { origin: "http://localhost:5173" };

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

// Static File Serving Access for Uploads
server.use("/uploads", express.static(path.join("/var/www/bulentgercek.com/", "uploads")));

// Next middlewares for error handling and no route found
server.use(errorHandler);
server.use(noRouteFound);

export default server;
