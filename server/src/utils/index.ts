import { Request } from "express";
import { z, ZodType } from "zod";
import { JsonValue } from "@prisma/client/runtime/library";

export const customEscape = (str: string): string => {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\//g, "&#x2F;")
    .replace(/\\/g, "&#x5C;")
    .replace(/`/g, "&#96;");
};

export const escapeArrayStrings = (value: string[]): string[] => {
  return value.map((v) => (typeof v === "string" ? customEscape(v.trim()) : v));
};

export const createRequiredString = (message: string, { minLength = 1, maxLength, shouldEscape = true }: { minLength?: number; maxLength?: number; shouldEscape?: boolean } = {}) => {
  let schema = z.string().trim();

  schema = schema.min(minLength, message);

  if (maxLength !== undefined) {
    schema = schema.max(maxLength, `Maximum length is ${maxLength} characters.`);
  }

  if (shouldEscape) {
    return schema.transform(customEscape).refine((str) => str.length > 0, "Cannot be an empty string after trimming/escaping.");
  }

  return schema.refine((str) => str.length > 0, "Cannot be an empty string after trimming/escaping.");
};

export const createRequiredUUIDString = (message: string) =>
  z
    .string()
    .trim()
    .uuid(message)
    .transform(customEscape)
    .refine((str) => str.length > 0, "Cannot be an empty string after trimming/escaping.");

export const createNonRequiredString = () => z.string().trim().transform(customEscape);

export const createRequiredArray = (message: string) =>
  z.array(z.string().transform(customEscape)).refine((data) => data.length > 0, {
    message,
    path: [],
  });

export const createNonRequiredArray = () => z.array(z.string().transform(customEscape)).optional().default([]);

export const defaultSchema = z.object({}).strict();

export const parseOrDefault = async <T>(value: any, schema?: ZodType<T, any, any>): Promise<T> => {
  return (schema ?? defaultSchema).parseAsync(value) as Promise<T>;
};

export const getStartOfDay = (date: Date): Date => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  return startOfDay;
};

export const parsePrisma = <T = any>(json: JsonValue): T => {
  if (typeof json === "string") {
    return JSON.parse(json) as T;
  } else if (typeof json === "number" || typeof json === "boolean") {
    return json as unknown as T;
  } else if (typeof json === "object" && json !== null) {
    return json as T;
  } else if (json === null) {
    return json as unknown as T;
  } else {
    throw new Error("Unsupported type");
  }
};

export const validateQueryFilter = (
  page?: string | undefined,
  limit?: string | undefined,
  orderBy?: string | undefined,
  options: {
    DEFAULT_LIMIT: number;
    DEFAULT_ORDER_BY: string;
    MAX_LIMIT: number;
  } = { DEFAULT_LIMIT: 20, DEFAULT_ORDER_BY: "desc", MAX_LIMIT: 100 },
) => {
  const { DEFAULT_LIMIT, DEFAULT_ORDER_BY, MAX_LIMIT } = options;

  const limitStr = typeof limit === "string" ? limit : String(DEFAULT_LIMIT);
  const validLimit = parseInt(limitStr, 10);
  if (isNaN(validLimit) || validLimit <= 0 || validLimit > (MAX_LIMIT ?? Number.POSITIVE_INFINITY)) {
    throw new Error(`Invalid limit. It should be a number between 1 and ${MAX_LIMIT}`);
  }

  const orderByStr = typeof orderBy === "string" ? orderBy : DEFAULT_ORDER_BY;
  const lowerCasedOrderBy = orderByStr.toLowerCase();
  if (!["asc", "desc"].includes(lowerCasedOrderBy)) {
    throw new Error(`Invalid orderBy. It should be '${DEFAULT_ORDER_BY}' or 'desc'`);
  }

  const pageStr = typeof page === "string" ? page : "1"; // Default to page 1 if not specified
  const validPage = parseInt(pageStr, 10);
  if (isNaN(validPage) || validPage <= 0) {
    throw new Error("Invalid page. It should be a positive number.");
  }
  const validOffset = (validPage - 1) * validLimit;

  return { validPage, validOffset, validLimit, validOrderBy: lowerCasedOrderBy as "asc" | "desc" };
};

const getNestedProperty = (obj: { [key: string]: any }, propPath: string): any => {
  return propPath.split(".").reduce((acc, part) => acc?.[part], obj);
};

export const removeDuplicates = (data: { [key: string]: any }[], props: string[]): { [key: string]: any }[] => {
  const seen = new Set<string>();

  return data.filter((item) => {
    const key = JSON.stringify(props.map((prop) => getNestedProperty(item, prop)));

    if (!seen.has(key)) {
      seen.add(key);
      return true;
    }
    return false;
  });
};

export const allowedOrigins = process.env.WEBSITE_URL!.split(",").map((origin) => origin.trim());

const isIp = (value: any): boolean => {
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Regex =
    /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;

  return ipv4Regex.test(value) || ipv6Regex.test(value);
};

const getClientIpFromXForwardedFor = (value: string | undefined): string | null => {
  if (!value) {
    return null;
  }

  const forwardedIps = value.split(",").map((e) => {
    const ip = e.trim();
    if (ip.includes(":")) {
      const splitted = ip.split(":");
      if (splitted.length === 2 && isIp(splitted[0])) {
        return splitted[0];
      }
    }
    return ip;
  });

  for (let i = forwardedIps.length - 1; i >= 0; i--) {
    if (forwardedIps[i] && isIp(forwardedIps[i])) {
      return forwardedIps[i] as string;
    }
  }

  return null;
};

export const extractClientIp = (request: Request): string => {
  const headers = [
    "X-Client-IP",
    "X-Forwarded-For",
    "CF-Connecting-IP",
    "Fastly-Client-Ip",
    "True-Client-Ip",
    "X-Real-IP",
    "X-Cluster-Client-IP",
    "X-Forwarded",
    "Forwarded-For",
    "Forwarded",
    "appengine-user-ip",
    "Cf-Pseudo-IPv4",
  ];

  for (const header of headers) {
    const value = request.headers[header.toLowerCase()] as string | undefined;
    if (value) {
      const ip = getClientIpFromXForwardedFor(value);
      if (ip) return ip;
    }
  }

  return (request.ip || request.socket.remoteAddress || (request.connection && request.connection.remoteAddress) || "unknown").replace(/:\d+[^:]*$/, "");
};
