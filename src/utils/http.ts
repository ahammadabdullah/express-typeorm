import { Response } from "express";

export const httpUtils = {
  sendSuccess: (
    res: Response,
    statusCode: number,
    data: any,
    message?: string
  ) => {
    return res.status(statusCode).json({
      success: true,
      message: message || "Success",
      data,
    });
  },

  sendError: (res: Response, statusCode: number, error: any) => {
    return res.status(statusCode).json({
      success: false,
      error,
    });
  },

  sendValidationError: (res: Response, errors: Record<string, string>) => {
    return res.status(400).json({
      error: errors,
    });
  },
};
