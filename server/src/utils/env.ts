import { z } from "zod";
import logger from "./logger";

const environmentSchema = z.object({
  PORT: z.number().default(3000),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  OPENAI_API_KEY: z.string(),
  OPENAI_CHATGPT_MODEL: z
    .enum([
      "gpt-3.5-turbo-0125",
      "gpt-3.5-turbo",
      "gpt-3.5-turbo-1106",
      "gpt-3.5-turbo-instruct",
      "gpt-3.5-turbo-16k",
      "gpt-3.5-turbo-0613",
      "gpt-3.5-turbo-16k-0613",
      "gpt-4-0125-preview",
      "gpt-4-turbo-preview",
      "gpt-4-1106-preview",
      "gpt-4-vision-preview",
      "gpt-4-1106-vision-preview",
      "gpt-4",
      "gpt-4-0613",
      "gpt-4-32k",
      "gpt-4-32k-0613",
    ])
    .refine((value) => {
      if (["gpt-3.5-turbo-16k", "gpt-3.5-turbo-0613", "gpt-3.5-turbo-16k-0613"].includes(value)) {
        logger.warn(`WARNING: ${value} is a legacy model and will be deprecated on June 13, 2024.`);
      }

      return true;
    })
    .default("gpt-3.5-turbo-0613"),
  WEBSITE_URL: z.string(),
  UNSPLASH_ACCESS_KEY: z.string(),
  UNSPLASH_SECRET_KEY: z.string(),
  COOKIE_SECRET_KEY: z.string(),
  JWT_SECRET_KEY: z.string(),
  JWT_REFRESH_SECRET_KEY: z.string(),
  BACKEND_URL: z.string().url(),

  EMAIL_USER: z.string().email(),
  EMAIL_PASSWORD: z.string(),
  EMAIL_DOMAIN: z.string().email(),
  CRON_SCHEDULE: z.string().default("0 12 * * 0"),
  EMAIL_HOST: z.string(),
  EMAIL_PORT: z.string().default("465"),
  EMAIL_SECRET_KEY: z.string(),

  POSTGRES_HOST: z.string().optional(),
  POSTGRES_USER: z.string().optional(),
  POSTGRES_PASSWORD: z.string().optional(),
  POSTGRES_DB: z.string().optional(),
  POSTGRES_PORT: z.number().optional().default(5432),

  DATABASE_URL: z.string(),

  REDIS_PASSWORD: z.string(),
  REDIS_PORT: z.number().default(6379),
  REDIS_URL: z.string(),
});

const env = {
  PORT: process.env.PORT ? Number(process.env.PORT) : 3000,
  NODE_ENV: process.env.NODE_ENV,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_CHATGPT_MODEL: process.env.OPENAI_CHATGPT_MODEL,
  WEBSITE_URL: process.env.WEBSITE_URL,
  UNSPLASH_ACCESS_KEY: process.env.UNSPLASH_ACCESS_KEY,
  UNSPLASH_SECRET_KEY: process.env.UNSPLASH_SECRET_KEY,
  COOKIE_SECRET_KEY: process.env.COOKIE_SECRET_KEY,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  JWT_REFRESH_SECRET_KEY: process.env.JWT_REFRESH_SECRET_KEY,
  BACKEND_URL: process.env.BACKEND_URL,

  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  EMAIL_DOMAIN: process.env.EMAIL_DOMAIN,
  CRON_SCHEDULE: process.env.CRON_SCHEDULE,
  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PORT: process.env.EMAIL_PORT,
  EMAIL_SECRET_KEY: process.env.EMAIL_SECRET_KEY,

  POSTGRES_HOST: process.env.POSTGRES_HOST,
  POSTGRES_USER: process.env.POSTGRES_USER,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
  POSTGRES_DB: process.env.POSTGRES_DB,
  POSTGRES_PORT: process.env.POSTGRES_PORT ? Number(process.env.POSTGRES_PORT) : 5432,

  DATABASE_URL: process.env.DATABASE_URL,

  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  REDIS_PORT: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
  REDIS_URL: process.env.REDIS_URL,
};

const parsedEnvResults = environmentSchema.safeParse(env);

if (!parsedEnvResults.success) {
  logger.error(parsedEnvResults.error.issues);
  throw new Error("Invalid environment variables");
}

export const parsedEnv = parsedEnvResults.data;

type EnvironmentSchemaType = z.infer<typeof environmentSchema>;

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvironmentSchemaType {}
  }
}
