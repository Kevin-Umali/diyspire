import Redis from "ioredis";
import logger from "./logger";

const initRedisClient = (): Redis | null => {
  if (!process.env.REDIS_URL) {
    logger.error("REDIS_URL environment variable is not set.");
    return null;
  }

  const maxRetries = 1;
  let retryAttempt = 0;

  const redis = new Redis(process.env.REDIS_URL, {
    connectTimeout: 15000,
    retryStrategy: (times) => {
      retryAttempt++;
      if (retryAttempt > maxRetries) {
        logger.info(`Max retry attempts reached (${maxRetries}). Not retrying.`);
        return null;
      }

      const delay = Math.min(times * 100, 5000);
      logger.info(`Retrying Redis connection. Attempt ${retryAttempt}. Next retry in ${delay}ms.`);
      return delay;
    },
    enableReadyCheck: true,
    enableOfflineQueue: true,
  });

  redis.on("connect", () => logger.info("Connected to Redis"));
  redis.on("ready", () => logger.info("Redis is ready"));
  redis.on("error", (err) => {
    logger.error("Redis error:", err);
    if (retryAttempt > maxRetries) {
      logger.info(`Disconnecting Redis after ${maxRetries} failed retries.`);
      redis.disconnect();
    }
  });
  redis.on("reconnecting", () => logger.info("Reconnecting to Redis"));
  redis.on("end", () => logger.info("Disconnected from Redis"));

  return redis;
};

export default initRedisClient;
