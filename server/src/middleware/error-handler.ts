import { NextFunction, Request, Response } from "express";
import sendResponse from "../utils/response-template";

const errorHandlerMiddleware = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  return sendResponse(res, { success: false, error: "Internal Server Error", message: process.env.NODE_ENV === "production" ? "*" : err.stack });
};

export default errorHandlerMiddleware;
