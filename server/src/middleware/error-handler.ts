import { NextFunction, Request, Response } from "express";
import { sendError } from "../utils/response-template";

/* eslint-disable @typescript-eslint/no-unused-vars */
const errorHandlerMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err.stack);
  sendError(res, "Something went wrong!");
};

export default errorHandlerMiddleware;
