import { NextFunction, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AnyRequest, BodyRequest } from "../middleware/schema-validate";
import { UpdateAccountSettingsRequest } from "../schema/account.schema";
import sendResponse from "../utils/response-template";

export const getAccountSettings = async (req: AnyRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;

    const prisma: PrismaClient = req.app.get("prisma");

    const accountSettings = await prisma.account.findUnique({
      where: {
        id: userId,
      },
      include: {
        profile: true,
        privacySettings: true,
        DIYCategory: true,
        DIYProject: true,
        DIYRecommendation: true,
        emailSubscriptions: true,
      },
    });

    if (!accountSettings) {
      return sendResponse(res, { success: false, error: "Account settings not found" }, 404);
    }

    return sendResponse(res, { success: true, data: accountSettings });
  } catch (error) {
    next(error);
  }
};

export const updateAccountSettings = async (req: BodyRequest<UpdateAccountSettingsRequest>, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { profile, privacySettings, DIYCategory, DIYProject, DIYRecommendation, emailSubscriptions } = req.body;
    const prisma: PrismaClient = req.app.get("prisma");
    const accountSettings = await prisma.account.update({
      where: {
        id: userId,
      },
      data: {
        profile,
        privacySettings,
        DIYCategory,
        DIYProject,
        DIYRecommendation,
        emailSubscriptions,
      },
    });
    return sendResponse(res, { success: true, data: accountSettings });
  } catch (error) {
    next(error);
  }
};
