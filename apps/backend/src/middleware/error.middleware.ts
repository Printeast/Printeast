import { NextFunction, Request, Response } from "express";
import { env } from "../config/env";

export const globalErrorHandler = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let code = err.statusCode || 500;
  let message = err.message || "An internal error occurred";
  let status = err.status || "ERROR";

  // Handle Prisma Specific Errors
  if (err.code === 'P2002') {
    code = 409;
    message = `Duplicate field value: ${err.meta?.target || 'unknown'}`;
    status = 'CONFLICT';
  } else if (err.code === 'P2025') {
    code = 404;
    message = 'Record not found';
    status = 'NOT_FOUND';
  }

  console.error(`[API ERROR] ${status} (${code}):`, {
    message: err.message,
    code: err.code,
    meta: err.meta,
    stack: env.NODE_ENV === "development" ? err.stack : undefined
  });

  res.status(code).json({
    success: false,
    error: String(status).toUpperCase(),
    message,
    details: env.NODE_ENV === "development" ? err.stack : null,
  });
};
