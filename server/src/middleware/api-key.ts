import { NextFunction, Request, Response } from "express";
import sendResponse from "../utils/response-template";

export const apiKeyMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = (req.headers["x-api-key"] || req.query["X-API-KEY"]) as string;

  if (!apiKey) {
    return sendResponse(res, { success: false, error: "Forbidden" }, 401);
  }

  if (apiKey !== process.env.EMAIL_API_KEY) {
    return sendResponse(res, { success: false, error: "Forbidden" }, 401);
  }

  next();
};
