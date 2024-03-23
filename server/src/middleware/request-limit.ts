import { NextFunction, Request, Response } from "express";
import { RateLimiterPrisma, RateLimiterRes } from "rate-limiter-flexible";
import { extractClientIpFromHeaders, isIp } from "../utils";
import logger from "../utils/logger";
import sendResponse from "../utils/response-template";

const keyGenerator = (request: Request): string => {
  let ip: string | null | undefined = request.ip || request.socket.remoteAddress || request.connection?.remoteAddress;
  ip = ip?.replace(/:\d+[^:]*$/, "");

  if (ip && isIp(ip)) {
    return ip;
  } else {
    ip = extractClientIpFromHeaders(request);
    if (ip) {
      return ip;
    } else {
      logger.error("Warning: Unable to extract client IP, defaulting to 'unknown'");
      return "unknown";
    }
  }
};

const rateLimitMiddleware = (rateLimiter: RateLimiterPrisma) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await rateLimiter.consume(keyGenerator(req), 1);
      next();
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error.message);
        sendResponse(res, { success: false, error: "An internal error occurred" }, 500);
      } else if (typeof error === "object" && error !== null && "msBeforeNext" in error) {
        const rateLimitError = error as RateLimiterRes;
        const secs = Math.round(rateLimitError.msBeforeNext / 1000) || 1;
        sendResponse(res, { success: false, error: "Too many requests" }, 429, { headers: { "Retry-After": String(secs) } });
      } else {
        logger.error("Unexpected error structure:", error);
        sendResponse(res, { success: false, error: "An unexpected error occurred" }, 500);
      }
    }
  };
};

export default rateLimitMiddleware;
