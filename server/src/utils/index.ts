import { promises as fs } from "fs";
import { Request } from "express";
import nodemailer from "nodemailer";
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
  sortBy?: string | undefined,
  options: {
    DEFAULT_LIMIT: number;
    DEFAULT_SORT_BY: string;
    MAX_LIMIT: number;
  } = { DEFAULT_LIMIT: 20, DEFAULT_SORT_BY: "desc", MAX_LIMIT: 100 },
) => {
  const { DEFAULT_LIMIT, DEFAULT_SORT_BY, MAX_LIMIT } = options;

  const limitStr = typeof limit === "string" ? limit : String(DEFAULT_LIMIT);
  const validLimit = parseInt(limitStr, 10);
  if (isNaN(validLimit) || validLimit <= 0 || validLimit > (MAX_LIMIT ?? Number.POSITIVE_INFINITY)) {
    throw new Error(`Invalid limit. It should be a number between 1 and ${MAX_LIMIT}`);
  }

  const sortByStr = typeof sortBy === "string" ? sortBy : DEFAULT_SORT_BY;
  const lowerCasedSortBy = sortByStr.toLowerCase();
  if (!["asc", "desc"].includes(lowerCasedSortBy)) {
    throw new Error(`Invalid sortBy. It should be '${DEFAULT_SORT_BY}' or 'desc'`);
  }

  const pageStr = typeof page === "string" ? page : "1"; // Default to page 1 if not specified
  const validPage = parseInt(pageStr, 10);
  if (isNaN(validPage) || validPage <= 0) {
    throw new Error("Invalid page. It should be a positive number.");
  }
  const validOffset = (validPage - 1) * validLimit;

  return { validPage, validOffset, validLimit, validSortBy: lowerCasedSortBy as "asc" | "desc" };
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

export const isIp = (value: string): boolean => {
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Regex =
    /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;

  return ipv4Regex.test(value) || ipv6Regex.test(value);
};

export const extractClientIpFromHeaders = (request: Request): string | null => {
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
    const rawValue: string | undefined = request.headers[header.toLowerCase()] as string | undefined;
    if (typeof rawValue === "string") {
      const potentialIps = rawValue.split(",");
      for (const potentialIp of potentialIps) {
        const trimmedIp = potentialIp.trim();
        if (isIp(trimmedIp)) {
          return trimmedIp;
        }
      }
    }
  }

  return null;
};

export const fillTemplate = async (templateSource: string, replacements: Record<string, string>, isHtml = false) => {
  let template = isHtml ? templateSource : await fs.readFile(templateSource, "utf8");

  for (const [key, value] of Object.entries(replacements)) {
    template = template.replace(new RegExp(`{{${key}}}`, "g"), value);
  }

  return template;
};

export const generateList = (items: string[]): string => items.map((item) => `<li class="list-item">${item}</li>`).join("");

export const generateProjectSteps = (
  details: {
    title: string;
    content: string;
    tips?: string;
  }[],
): string =>
  details
    .map(
      (detail, index) => `
    <div class="subtitle"><strong>${index + 1}. ${detail.title}</strong></div>
    <p class="content">${detail.content}</p>
    <p class="content"><strong>Tips:</strong> ${detail.tips ?? "N/A"}</p>
  `,
    )
    .join("");

export const sendEmail = async ({ to, subject, text, html, unsubscribeUrl }: { to: string; subject: string; text: string; html: string; unsubscribeUrl: string }) => {
  try {
    const { EMAIL_USER, EMAIL_PASSWORD, EMAIL_DOMAIN, EMAIL_HOST = "smtp.hostinger.com", EMAIL_PORT } = process.env;

    const transporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: parseInt(EMAIL_PORT ?? "465", 10),
      secure: true,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD,
      },
      list: {
        unsubscribe: {
          url: unsubscribeUrl,
          comment: "Unsubscribe",
        },
      },
    });

    await transporter.sendMail({
      from: EMAIL_DOMAIN,
      to,
      subject,
      text: text,
      html: html,
    });
  } catch (error) {
    console.error(`Failed to send to: ${to}`, error);
  }
};
