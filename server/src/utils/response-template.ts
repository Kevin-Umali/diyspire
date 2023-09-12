import { Response } from "express";

interface SuccessResponseData {
  [key: string]: any;
}

export function sendSuccess(
  res: Response,
  data: SuccessResponseData,
  status: number = 200,
) {
  res.status(status).setHeader("Content-Type", "application/json").json({
    success: true,
    data,
  });
}

export function sendError(
  res: Response,
  message: string,
  status: number = 500,
) {
  res.status(status).setHeader("Content-Type", "application/json").json({
    success: false,
    error: message,
  });
}
