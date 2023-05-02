import { Request, Response, NextFunction } from "express";

/**
 * Error Handler for Express
 * @param err Error
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  // Wrap the next function call in a Promise.resolve() to handle
  // errors that occur in asynchronous code (e.g., Promises)
  Promise.resolve()
    .then(() => {
      if (err instanceof SyntaxError && "body" in err) {
        res.status(400).json({
          message: `Invalid request body: ${err.message}.`,
        });
      }

      // TODO: Add more specific error handling cases here, e.g.:
      // if (err instanceof ValidationError) {
      //   return res.status(400).json({ message: err.message });
      // }

      res.status(500).json({
        message: `Internal server error: ${err}.`,
      });
    })
    .catch(next);
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
 * @param err Error
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
