import { NextFunction, Request, Response } from "express";
import OpenAI from "openai";
import { PrismaClient } from "@prisma/client";
import sendResponse from "../utils/response-template";

export const healthCheck = async (req: Request, res: Response, _next: NextFunction) => {
  const prismaStatus = { name: "Prisma", status: "Outage", message: "Prisma is down" };
  const openaiStatus = { name: "Openai", status: "Outage", message: "Openai is down" };

  const prisma: PrismaClient = req.app.get("prisma");
  const openai: OpenAI = req.app.get("openai");

  const [prismaResult, openaiResult] = await Promise.allSettled([prisma.$queryRaw`SELECT 1`, openai.get("https://status.openai.com/api/v2/status.json")]);

  if (prismaResult.status === "fulfilled") {
    prismaStatus.status = "Normal";
    prismaStatus.message = "Prisma is operational";
  } else {
    console.error("Prisma error:", prismaResult.reason);
  }

  if (openaiResult.status === "fulfilled") {
    const openaiValue = openaiResult.value as { status: { indicator: string; description: string } };
    openaiStatus.status = openaiValue.status.indicator === "none" ? "Normal" : "Outage";
    openaiStatus.message = openaiValue.status.indicator === "none" ? "Openai is operational" : openaiValue.status.description;
  } else {
    console.error("OpenAI error:", openaiResult.reason);
  }

  const apiStatus = { name: "API", status: "Normal", message: "API is operational" };

  const allServicesOperational = prismaStatus.status === "Normal" && openaiStatus.status === "Normal";

  const response = {
    uptime: process.uptime(),
    responseTime: process.hrtime(),
    message: allServicesOperational ? "All Systems Are Operational" : "One Or More Services Are Down",
    timeStamp: Date.now(),
    apiStatus,
    prismaStatus,
    openaiStatus,
  };

  if (allServicesOperational) {
    return sendResponse(res, { success: true, data: response });
  } else {
    return sendResponse(res, { success: true, data: response });
  }
};
