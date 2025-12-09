import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error("Global error handler", error);

  const statusCode = (error as any).statusCode || 500;
  const message = error.message || "Internal Server Error";

  return res.status(statusCode).json({
    success: false,
    error: message,
  });
};
