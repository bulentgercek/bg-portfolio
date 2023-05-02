import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";

import env from "./validEnv";
import api from "./api";
import { errorHandler, noRouteFound } from "./errorHandler";

/**
 *  Server initialization and configuration
 */
const server = express();

// Helmet for security
server.use(helmet());

// Static File Serving Access for Uploads
server.use("/uploads", express.static(path.join(env.UPLOADS_BASE_PATH, "uploads")));

// Cors Origin for Client Access
server.use(cors({ origin: env.CLIENT_URL }));

// Set Body size limit for file uploads
server.use(express.json({ limit: "10mb" }));

// Base Route Response
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
