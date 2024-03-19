import { Request, Response } from "express";
import rateLimit from "express-rate-limit";
import logger from "../utils/logger";
import sendResponse from "../utils/response-template";

const keyGenerator = (request: Request, _response: Response): string => {
  if (!request.ip) {
    logger.error("Warning: request.ip is missing!");
    return request.socket.remoteAddress as string;
  }
  return request.ip.replace(/:\d+[^:]*$/, "");
};

const limiter = rateLimit({
  windowMs: 10000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req: Request, res: Response) => sendResponse(res, { success: false, error: "Too many requests, please try again later." }, 429),
  keyGenerator: keyGenerator,
});

export default limiter;
