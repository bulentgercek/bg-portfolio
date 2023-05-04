import { Request, Response, NextFunction } from "express";
import z from "zod";

import { ApiController as ac } from "./apiController";

/**
 * Validation Custom Error
 */
export class ValidationError<TParams extends z.ZodTypeAny, TBody extends z.ZodTypeAny> extends Error {
  public error: ac.ValidateResults<TParams, TBody>["error"];

  constructor(message: string, error: ac.ValidateResults<TParams, TBody>["error"]) {
    super(message);
    this.name = "ValidationError";
    this.error = error;
  }
}

/**
 * Database Custom Error
 */
export class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DatabaseError";
  }
}

/**
 * Error Handler for Express
 * @param error Error
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof SyntaxError && "body" in error) {
    res.status(400).json({
      message: `Invalid request body: ${error.message}.`,
    });
  } else if (error instanceof ValidationError) {
    res.status(400).json({ message: error.message, error: error });
  } else if (error instanceof DatabaseError) {
    res.status(500).json({ message: error.message });
  } else {
    res.status(500).json({
      message: `Internal server error: ${error}.`,
    });
  }
};

/**
 * No route for express
 * @param req Request
 * @param res Response
 */
export const noRouteFound = (req: Request, res: Response) => {
  res.status(404).json({
    message: `No route not found at ${req.originalUrl}.`,
  });
};

/**
 * Display formatted console route errors
 * @param error Error
 * @param subject string
 */
export const consoleRouteError = (error: unknown, req: Request) => {
  const routePath = req.route.path;
  const requestMethod = req.method;
  const requestBaseUrl = req.baseUrl;
  const errorMessage = (error as Error).message || "Unknown error";
  const message = `Error: ${requestMethod} ${requestBaseUrl} "${routePath}": ${errorMessage}`;
  console.error(message);
};
