import { Request, Response } from "express";

export function noRouteFound(req: Request, res: Response) {
  res.status(404);
  res.json({
    message: `No route not found at ${req.originalUrl}.`,
  });
}
