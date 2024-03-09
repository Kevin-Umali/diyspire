import express, { Express, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import dotenv from "dotenv";
import cron from "node-cron";
import OpenAI from "openai";
import * as nodeFetch from "node-fetch";
import cookieParser from "cookie-parser";
import { createApi } from "unsplash-js";
import { PrismaClient } from "@prisma/client";

import { guideRoutes, unsplashRoutes, openaiRoutes, shareRoutes, counterRoutes, communityRoutes, authenticationRoutes, healthcheckRoutes, emailRoutes } from "./routes/index.routes";
import { sendError } from "./utils/response-template";
import errorHandlerMiddleware from "./middleware/error-handler";
import limiter from "./middleware/request-limit";
import getConditionalCache from "./middleware/cache-response";
import userAgentMiddleware from "./middleware/useragent-parser";
import { allowedOrigins } from "./utils";
import { performMonthlyDiyEmailDistribution } from "./services/monthly-diy-project.services";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY!,
  fetch: nodeFetch.default as unknown as typeof fetch,
});

const prisma = new PrismaClient();

const app: Express = express();

app.set("openai", openai);
app.set("unsplash", unsplash);
app.set("prisma", prisma);

app.use(cookieParser(process.env.COOKIE_SECRET_KEY));
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
app.use(compression());

app.use(userAgentMiddleware);

app.use(limiter);

cron.schedule(process.env.CRON_SCHEDULE!, async () => await performMonthlyDiyEmailDistribution(prisma, openai, unsplash), {
  scheduled: true,
  timezone: "Asia/Manila",
});

app.use("/api/v1/healthcheck", healthcheckRoutes);

app.use("/api/v1/auth", authenticationRoutes);
app.use("/api/v1/email", emailRoutes);

const oneDayCacheMiddleware = getConditionalCache("24 hours");
app.use("/api/v1/guide", oneDayCacheMiddleware, guideRoutes);
app.use("/api/v1/image", oneDayCacheMiddleware, unsplashRoutes);
app.use("/api/v1/community", oneDayCacheMiddleware, communityRoutes);

const twentyFourCacheMiddleware = getConditionalCache("24 days");
app.use("/api/v1/share", twentyFourCacheMiddleware, shareRoutes);

const openaiCacheMiddleware = getConditionalCache("2 hours");
app.use("/api/v1/generate", openaiCacheMiddleware, openaiRoutes);

app.use("/api/v1/counter", counterRoutes);

app.get("*", (_, res: Response) => {
  sendError(res, "API Path Not Found", 404);
});

app.use(errorHandlerMiddleware);

export default app;
