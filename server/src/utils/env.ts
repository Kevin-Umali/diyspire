import { z } from "zod";

const environmentSchema = z.object({
  PORT: z.number().default(3000),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  OPENAI_API_KEY: z.string(),
  WEBSITE_URL: z.string().url(),
  UNSPLASH_ACCESS_KEY: z.string(),
  UNSPLASH_SECRET_KEY: z.string(),
  COOKIE_SECRET_KEY: z.string(),
  JWT_SECRET_KEY: z.string(),
  JWT_REFRESH_SECRET_KEY: z.string(),
  MIGRATE_FLAG: z.boolean().default(false),
  BACKEND_URL: z.string().url(),

  EMAIL_USER: z.string().email(),
  EMAIL_PASSWORD: z.string(),
  EMAIL_DOMAIN: z.string().email(),
  CRON_SCHEDULE: z.string().default("0 12 * * 0"),
  EMAIL_HOST: z.string(),
  EMAIL_PORT: z.string().default("465"),
  EMAIL_SECRET_KEY: z.string(),

  POSTGRES_HOST: z.string(),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string(),
  POSTGRES_PORT: z.number().optional().default(5432),

  DATABASE_URL: z
    .string()
    .regex(/^postgresql:\/\/[\w]+:[\w]+@[\w.]+:\d+\/[\w]+$/)
    .default(""),
});

const env = {
  PORT: process.env.PORT ? Number(process.env.PORT) : 3000,
  NODE_ENV: process.env.NODE_ENV,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  WEBSITE_URL: process.env.WEBSITE_URL,
  UNSPLASH_ACCESS_KEY: process.env.UNSPLASH_ACCESS_KEY,
  UNSPLASH_SECRET_KEY: process.env.UNSPLASH_SECRET_KEY,
  COOKIE_SECRET_KEY: process.env.COOKIE_SECRET_KEY,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  JWT_REFRESH_SECRET_KEY: process.env.JWT_REFRESH_SECRET_KEY,
  MIGRATE_FLAG: process.env.MIGRATE_FLAG,
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
};

const parsedEnvResults = environmentSchema.safeParse(env);

if (!parsedEnvResults.success) {
  console.error(parsedEnvResults.error.issues);
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
