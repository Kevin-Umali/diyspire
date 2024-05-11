import { Queue, Worker } from "bullmq";
import type { Redis } from "ioredis";
import type OpenAI from "openai";
import { createApi } from "unsplash-js";
import type { EmailSubscription, PrismaClient } from "@prisma/client";
import logger from "../utils/logger";
import { processEmailQueue } from "./emailQueue";

interface JobData {
  allEmailSubscribers: EmailSubscription[];
  excludedProjectsList: string;
}

const createEmailQueueAndWorker = (redis: Redis, prisma: PrismaClient, openai: OpenAI, unsplash: ReturnType<typeof createApi>) => {
  const emailQueue = new Queue("emailQueue", { connection: redis });
  const emailWorker = new Worker<JobData>(
    "emailQueue",
    async (job) => {
      if (!Array.isArray(job.data.allEmailSubscribers) || typeof job.data.excludedProjectsList !== "string") {
        throw new Error("Invalid job data format");
      }

      const { allEmailSubscribers, excludedProjectsList } = job.data;

      await processEmailQueue(prisma, openai, unsplash, { allEmailSubscribers, excludedProjectsList });
    },
    { connection: redis, removeOnComplete: { age: 3600 }, removeOnFail: { age: 3600 } },
  );

  emailWorker.on("completed", (job) => {
    logger.info(`Job ${job.id} has completed`);
  });

  emailWorker.on("failed", (job, err) => {
    logger.info(`Job ${job?.id} has failed with error ${err.message}`);
  });

  return { emailQueue, emailWorker };
};

export { createEmailQueueAndWorker };
