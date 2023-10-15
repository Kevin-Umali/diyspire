import { Request, Response } from "express";
import rateLimit from "express-rate-limit";
import { sendError } from "../utils/response-template";

/* eslint-disable @typescript-eslint/no-unused-vars */
const keyGenerator = (request: Request, _response: Response): string => {
  if (!request.ip) {
    console.error("Warning: request.ip is missing!");
    return request.socket.remoteAddress as string;
  }
  return request.ip.replace(/:\d+[^:]*$/, "");
};

const limiter = rateLimit({
  windowMs: 10000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req: Request, res: Response) => sendError(res, "You can't make any more requests at the moment. Try again later", 429),
  keyGenerator: keyGenerator,
});

export default limiter;
