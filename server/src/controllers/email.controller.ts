import { NextFunction, Request, Response } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { PrismaClient } from "@prisma/client";
import { BodyRequest, QueryRequest } from "../middleware/schema-validate";
import { SubscribeEmailRequest, UnsubscribeEmailQueryRequest } from "../schema/email.schema";
import { emailQueue } from "../server";
import sendResponse from "../utils/response-template";

export const unsubscribeEmail = async (req: QueryRequest<UnsubscribeEmailQueryRequest>, res: Response, next: NextFunction) => {
  try {
    if (!req?.email?.email || !req?.email?.id || req?.email?.email !== req.query.email) {
      return sendResponse(res, { success: false, error: "Unauthorized or invalid token." }, 401);
    }

    const { id } = req.email;

    const prisma: PrismaClient = req.app.get("prisma");

    const updatedSubscription = await prisma.emailSubscription.update({
      where: {
        id: Number(id),
        unsubscribe: false,
      },
      data: {
        unsubscribe: true,
      },
    });

    return res.send(`Subscription "${updatedSubscription.address}" has been successfully unsubscribed.`);
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2025") {
      return res.send("Subscription not found.");
    }

    next(error);
  }
};

export const subscribeEmail = async (req: BodyRequest<SubscribeEmailRequest>, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    const prisma: PrismaClient = req.app.get("prisma");

    const createSubscription = await prisma.emailSubscription.create({
      data: {
        address: email,
        unsubscribe: false,
      },
    });

    return sendResponse(res, { success: true, message: `Subscription "${createSubscription.address}" has been successfully created.` }, 201);
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
      return sendResponse(res, { success: false, error: "Email already subscribed." }, 400);
    } else {
      next(error);
    }
  }
};

export const sendSubscriberDiyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const prisma: PrismaClient = req.app.get("prisma");

    const allEmailSubscribers = await prisma.emailSubscription.findMany({
      where: {
        unsubscribe: false,
      },
      select: {
        id: true,
        address: true,
        unsubscribe: true,
      },
    });

    if (allEmailSubscribers.length === 0) {
      return sendResponse(res, { success: false, error: "No email subscribers found." }, 404);
    }

    const existingMonthlyDiyProject = await prisma.generatedMonthlyDIY.findMany();

    const existingProjects: string[] = existingMonthlyDiyProject.map((diyProject) => diyProject.name);
    const excludedProjectsList: string = existingProjects.join(", ");

    await emailQueue.add("emailQueue", { allEmailSubscribers, excludedProjectsList }, { removeOnComplete: true, removeOnFail: true });

    return sendResponse(res, { success: true, message: `Processing ${allEmailSubscribers.length} emails.` });
  } catch (error) {
    next(error);
  }
};
