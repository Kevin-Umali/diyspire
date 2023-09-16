import { Request, Response } from "express";
import rateLimit from "express-rate-limit";

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
  max: 5,
  message: "You can't make any more requests at the moment. Try again later",
  keyGenerator: keyGenerator,
});

export default limiter;
