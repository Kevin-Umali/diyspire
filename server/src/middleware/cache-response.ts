import apicache from "apicache";
import { Request, Response, NextFunction } from "express";

function getConditionalCache(duration: string) {
  if (process.env.NODE_ENV === "test") {
    return (req: Request, res: Response, next: NextFunction) => next();
  }

  const cacheOptions = {
    statusCodes: {
      include: [200],
    },
    appendKey: (req: Request) => JSON.stringify(req.body),
  };

  return apicache.options(cacheOptions).middleware(duration);
}

export default getConditionalCache;
