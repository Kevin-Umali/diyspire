import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Express, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import cron from "node-cron";
import * as nodeFetch from "node-fetch";
import OpenAI from "openai";
import { createApi } from "unsplash-js";
import { PrismaClient } from "@prisma/client";
import errorHandlerMiddleware from "./middleware/error-handler";
import limiter from "./middleware/request-limit";
import userAgentMiddleware from "./middleware/useragent-parser";
import { authenticationRoutes, communityRoutes, counterRoutes, emailRoutes, guideRoutes, healthcheckRoutes, openaiRoutes, projectRoutes, unsplashRoutes } from "./routes/index.routes";
import { performMonthlyDiyEmailDistribution } from "./services/monthly-diy-project.services";
import { allowedOrigins } from "./utils";
import sendResponse from "./utils/response-template";
import "./utils/env";
import logger from "./utils/logger";
import initRedisClient from "./utils/redis";

dotenv.config();

const app: Express = express();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
  fetch: nodeFetch.default as unknown as typeof fetch,
});
const prisma = new PrismaClient();
const redis = initRedisClient();

app.use(compression());
app.use(helmet());
app.use(
  cors({
    origin: function (origin, callback) {
      if (process.env.NODE_ENV !== "production") {
        callback(null, true);
      } else if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET_KEY));

app.use(limiter);

app.set("openai", openai);
app.set("unsplash", unsplash);
app.set("prisma", prisma);
app.set("redis", redis);

app.use(userAgentMiddleware);

app.use(morgan("tiny", { skip: () => process.env.NODE_ENV === "test", stream: { write: (message: string) => logger.info(message.trim()) } }));

cron.schedule(process.env.CRON_SCHEDULE, async () => await performMonthlyDiyEmailDistribution(prisma, openai, unsplash), {
  scheduled: true,
  timezone: "Asia/Manila",
});

app.use("/api/v1/healthcheck", healthcheckRoutes);
app.use("/api/v1/auth", authenticationRoutes);
app.use("/api/v1/email", emailRoutes);
app.use("/api/v1/counter", counterRoutes);

// One day cache
app.use("/api/v1/guide", guideRoutes);
app.use("/api/v1/image", unsplashRoutes);
app.use("/api/v1/community", communityRoutes);

app.use("/api/v1/project", projectRoutes);

app.use("/api/v1/generate", openaiRoutes);

app.get("*", (_, res: Response) => sendResponse(res, { success: false, error: "API Path Not Found" }, 404));

app.use(errorHandlerMiddleware);

export { app, prisma, redis };
