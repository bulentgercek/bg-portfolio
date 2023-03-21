import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof SyntaxError && "body" in err) {
    res.status(400).json({
      message: `${err}.`,
    });
  } else {
    res.status(500).json({
      message: `Internal server error: ${err}.`,
    });
  }
}

export function noRouteFound(req: Request, res: Response) {
  res.status(404).json({
    message: `No route not found at ${req.originalUrl}.`,
  });
}
