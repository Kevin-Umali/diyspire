import apicache from "apicache";
import { NextFunction, Request, Response } from "express";

const getConditionalCache = (duration: string) => {
  if (process.env.NODE_ENV === "test") {
    return (_req: Request, _res: Response, next: NextFunction) => next();
  }

  const cacheOptions = {
    statusCodes: {
      include: [200],
    },
    appendKey: (req: Request) => JSON.stringify(req.body),
  };

  return apicache.options(cacheOptions).middleware(duration);
};

export default getConditionalCache;
