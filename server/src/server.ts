import express, { Express, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import apicache from "apicache";
import OpenAI from "openai";
import { createApi } from "unsplash-js";
import * as nodeFetch from "node-fetch";

import v1Routes from "./v1/routes";
import { sendError } from "./utils/response-template";
import errorHandlerMiddleware from "./middleware/error-handler";
import limiter from "./middleware/request-limit";

// Load environment variables from .env file
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY!,
  fetch: nodeFetch.default as unknown as typeof fetch,
});

const app: Express = express();

app.set("openai", openai);
app.set("unsplash", unsplash);

const cache = apicache.options({
  statusCodes: {
    include: [200],
  },
  appendKey: (req) => JSON.stringify(req.body),
}).middleware;

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

// Bypass cache if in test environment
if (process.env.NODE_ENV !== "test") {
  app.use(cache("10 hours"));
}

app.use("/v1", v1Routes);

app.get("*", (_, res: Response) => {
  sendError(res, "API Path Not Found", 404);
});

app.use(errorHandlerMiddleware);

export default app; // Export the app instance
