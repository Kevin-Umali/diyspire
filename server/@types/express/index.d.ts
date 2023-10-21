import "express-serve-static-core";

interface UserAgentInfo {
  isMobile?: boolean;
  isDesktop?: boolean;
  isBot?: boolean;
  browser?: string;
  version?: string;
  os?: string;
  platform?: string;
}
declare module "express-serve-static-core" {
  interface Request {
    useragent?: UserAgentInfo;
  }
}
