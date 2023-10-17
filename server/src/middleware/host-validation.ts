import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response-template";

interface Config {
  hosts?: (string | RegExp)[];
  referers?: (string | RegExp)[];
  mode?: "both" | "either";
  fail?: (req: Request, res: Response, next: NextFunction) => void;
}

const defaultFailHandler = (_req: Request, res: Response) => {
  sendError(res, "Forbidden", 403);
};

const isAllowed = (headerValue: string | undefined, allowedValues: Array<string | RegExp> = []): boolean => {
  if (!headerValue) return false;

  // Normalize header value by removing trailing slash
  const normalizedHeaderValue = headerValue.endsWith("/") ? headerValue.slice(0, -1) : headerValue;

  return allowedValues.some((candidate) => {
    if (typeof candidate === "string") {
      const normalizedCandidate = candidate.endsWith("/") ? candidate.slice(0, -1) : candidate;
      return normalizedCandidate === normalizedHeaderValue;
    } else if (candidate instanceof RegExp) {
      return candidate.test(headerValue);
    }
    return false;
  });
};

const checkAllowedType = (type: string | RegExp) => {
  if (!(typeof type === "string" || type instanceof RegExp)) {
    throw new Error(`Invalid type: ${type}. Allowed types are string or RegExp.`);
  }
};

export default function referrerAndHostCheck(config: Config) {
  if (!config) {
    throw new Error("A config object must be provided as the first argument to this function.");
  }

  const { hosts, referers, mode = "both", fail = defaultFailHandler } = config;

  if (!Array.isArray(hosts) && !Array.isArray(referers)) {
    throw new Error("Either hosts or referers must be provided in the config.");
  }

  hosts?.forEach(checkAllowedType);
  referers?.forEach(checkAllowedType);

  return function (req: Request, res: Response, next: NextFunction) {
    let allowed = true;
    switch (mode) {
      case "both":
        if (hosts && referers) {
          allowed = isAllowed(req.headers.host, hosts) && isAllowed(req.headers.referer, referers);
        } else if (hosts) {
          allowed = isAllowed(req.headers.host, hosts);
        } else if (referers) {
          allowed = isAllowed(req.headers.referer, referers);
        }
        break;
      case "either":
        allowed = isAllowed(req.headers.host, hosts) || isAllowed(req.headers.referer, referers);
        break;
    }

    allowed ? next() : fail(req, res, next);
  };
}
