import { PrismaClient } from "@prisma/client";
import app from "./server";
import logger from "./utils/logger";

const PORT: number = Number(process.env.PORT) || 3000;
const prisma = new PrismaClient();

const server = app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});

process.on("SIGINT", async () => {
  logger.info("Received SIGINT. Shutting down gracefully...");
  server.close(async () => {
    await prisma.$disconnect();
    logger.info("Server and Prisma disconnected!");
    process.exit(0);
  });
});

process.on("SIGTERM", async () => {
  logger.info("Received SIGTERM. Shutting down gracefully...");
  server.close(async () => {
    await prisma.$disconnect();
    logger.info("Server and Prisma disconnected!");
    process.exit(0);
  });
});
