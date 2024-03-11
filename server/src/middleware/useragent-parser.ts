import { NextFunction, Request, Response } from "express";
import { isbot } from "isbot";
import UAParser from "ua-parser-js";

const userAgentMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const userAgentString = req.headers["user-agent"] ?? "";
  const parser = new UAParser(userAgentString);

  const result = parser.getResult();
  const deviceType = result.device.type;

  req.useragent = {
    isMobile: deviceType === "mobile",
    isDesktop: deviceType === undefined || !["wearable", "mobile"].includes(deviceType),
    isBot: isbot(userAgentString),
    browser: result.browser.name ?? "Unknown",
    version: result.browser.version ?? "Unknown",
    os: result.os.name ?? "Unknown",
    platform: result.os.name ?? "Unknown",
  };

  next();
};

export default userAgentMiddleware;
