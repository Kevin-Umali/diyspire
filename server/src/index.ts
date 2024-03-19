import { app, prisma, redis } from "./server"; // Adjust the path as necessary
import logger from "./utils/logger";

const server = app.listen(process.env.PORT || 3000, () => {
  logger.info(`Server running on http://localhost:${process.env.PORT || 3000}`);
});

const gracefulShutdown = async (signal: string) => {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  try {
    server.close(() => {
      logger.info("HTTP server closed.");
    });

    if (redis) {
      redis.disconnect();
      logger.info("Redis client disconnected.");
    }

    await prisma.$disconnect();
    logger.info("Prisma client disconnected.");

    process.exit(0);
  } catch (error) {
    logger.error("Failed to shut down gracefully:", error);
    process.exit(1);
  }
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
