import { Request, Response } from "express";

export function errorHandler(err: Error, req: Request, res: Response) {
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV !== "production" ? err.stack : "",
  });
}
