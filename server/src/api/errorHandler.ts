import { NextFunction, Request, Response } from "express";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // If the error happens even we have status 200;
  // so, that means we have an internal server problem
  // Otherwise it shows the current error
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV !== "production" ? err.stack : "",
  });
}
