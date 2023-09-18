import express, { Express, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import OpenAI from "openai";
import { createApi } from "unsplash-js";
import * as nodeFetch from "node-fetch";
import { PrismaClient } from "@prisma/client";

import {
  guideRoutes,
  unsplashRoutes,
  openaiRoutes,
  shareRoutes,
} from "./routes/index.routes";
import { sendError } from "./utils/response-template";
import errorHandlerMiddleware from "./middleware/error-handler";
import limiter from "./middleware/request-limit";
import getConditionalCache from "./middleware/cache-response";

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

app.use(helmet());

const allowedOrigins = process.env
  .WEBSITE_URL!.split(",")
  .map((origin) => origin.trim());

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
    optionsSuccessStatus: 200,
  }),
);

app.use(express.json());

app.use(limiter);

const oneDayCacheMiddleware = getConditionalCache("24 hours");
app.use("/api/v1/guide", oneDayCacheMiddleware, guideRoutes);
app.use("/api/v1/image", oneDayCacheMiddleware, unsplashRoutes);
app.use("/api/v1/share", oneDayCacheMiddleware, shareRoutes);

const openaiCacheMiddleware = getConditionalCache("2 hours");
app.use("/api/v1/generate", openaiCacheMiddleware, openaiRoutes);

app.get("*", (_, res: Response) => {
  sendError(res, "API Path Not Found", 404);
});

app.use(errorHandlerMiddleware);

export default app;
