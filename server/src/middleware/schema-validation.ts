import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

import { sendSuccess } from "../utils/response-template";
const validationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendSuccess(res, { errors: errors.array() }, 400);
  }
  next();
};

export default validationMiddleware;
