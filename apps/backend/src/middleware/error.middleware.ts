import { NextFunction, Request, Response } from "express";
import { env } from "../config/env";

export const globalErrorHandler = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error("API ERROR:", err);
  const code = err.statusCode || 500;




  res.status(code).json({
    success: false,
    error: (err.status || "ERROR").toUpperCase(),
    message: err.message || "An internal error occurred",
    details: env.NODE_ENV === "development" ? err.stack : null,
  });
};
