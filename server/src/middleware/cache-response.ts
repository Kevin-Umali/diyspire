import apicache from "apicache";
import { NextFunction, Request, Response } from "express";
import { Redis } from "ioredis";
import logger from "../utils/logger";

interface UserPayload {
  id: string;
  username: string;
}

interface ExtendedRequest extends Request {
  user?: UserPayload;
}

const unifiedConditionalCacheMiddleware = <T>(duration: string | number) => {
  return async (req: ExtendedRequest, res: Response<T>, next: NextFunction) => {
    const redisClient = req.app.get("redis") as Redis;

    if (!redisClient || redisClient.status !== "ready") {
      logger.info("Using apicache as fallback");

      const apicachiSend = getApicacheMiddleware(duration);

      return apicachiSend(req, res, next);
    }

    logger.info("Using Redis for caching");

    const cacheType = req.user?.id ? `user:${req.user.id}` : "global";
    const key = `cache:${cacheType}:${req.originalUrl}`;

    try {
      const cachedResponse = await redisClient.get(key);
      if (cachedResponse) {
        logger.info(`Serving from ${cacheType} cache`);
        return res.status(200).send(JSON.parse(cachedResponse) as T | undefined);
      }
    } catch (error) {
      logger.error(`Error retrieving ${cacheType} cache`, error);
    }

    const originalSend = res.send.bind(res);
    res.send = (body?: T): Response<T> => {
      if (res.statusCode === 200 && body !== undefined) {
        (async () => {
          try {
            await redisClient.set(key, JSON.stringify(body), "EX", typeof duration === "string" ? duration : duration.toString());
            logger.info(`Response cached for ${cacheType}`);
          } catch (error) {
            logger.error(`Error caching response for ${cacheType}`, error);
          }
        })();
      }
      return originalSend(body);
    };

    next();
  };
};

const getApicacheMiddleware = (duration: string | number) => {
  const cacheOptions = {
    statusCodes: {
      include: [200],
    },
    appendKey: (req: Request) => JSON.stringify(req.body),
  };
  const cacheDuration = typeof duration === "number" ? `${duration} seconds` : duration;

  return apicache.options(cacheOptions).middleware(cacheDuration);
};

export default unifiedConditionalCacheMiddleware;
