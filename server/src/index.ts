import { PrismaClient } from "@prisma/client";
import app from "./server";

const PORT: number = Number(process.env.PORT) || 3000;
const prisma = new PrismaClient();

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

process.on("SIGINT", async () => {
  console.log("Received SIGINT. Shutting down gracefully...");
  server.close(async () => {
    await prisma.$disconnect();
    console.log("Server and Prisma disconnected!");
    process.exit(0);
  });
});

process.on("SIGTERM", async () => {
  console.log("Received SIGTERM. Shutting down gracefully...");
  server.close(async () => {
    await prisma.$disconnect();
    console.log("Server and Prisma disconnected!");
    process.exit(0);
  });
});
