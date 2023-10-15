import { JsonValue } from "@prisma/client/runtime/library";
import { z } from "zod";

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

  return { validLimit, validOrderBy: lowerCasedOrderBy as "asc" | "desc" };
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
