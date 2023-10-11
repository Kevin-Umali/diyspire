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
