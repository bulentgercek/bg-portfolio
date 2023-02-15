import express from "express";
import cors from "cors";
import helmet from "helmet";
import { errorHandler } from "./errorHandler";

import api from "./api";

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

// // Throw an 404 error for other router then defined above
// server.get("*", (req, res, next: NextFunction) => {
//   try {
//     throw Error("Server 404 Error: Sorry, nothing you can find on this route.");
//   } catch (error) {
//     res.status(404);
//     next(error);
//   }
// });

// Api Router
server.use("/api", api);

// Next router for error handling
server.use(errorHandler);

export default server;
