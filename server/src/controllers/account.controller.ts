import { compare, hash } from "bcrypt";
import { NextFunction, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
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
        notifications: true,
      },
    });

    if (!accountSettings) {
      return sendResponse(res, { success: false, error: "Account settings not found" }, 404);
    }

    return sendResponse(res, {
      success: true,
      data: {
        username: accountSettings.username,
        profile: accountSettings.profile,
        notifications: accountSettings.notifications,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateAccountSettings = async (req: BodyRequest<UpdateAccountSettingsRequest>, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { username, email, fullName, newsletter, updates, currentPassword, newPassword } = req.body;
    const prisma: PrismaClient = req.app.get("prisma");

    const accountSettings = await prisma.$transaction(
      async (tx) => {
        const account = await tx.account.findUnique({
          where: { id: userId },
          include: {
            profile: true,
            notifications: true,
          },
        });

        if (!account) {
          throw new Error("Account settings not found");
        }

        if (username || email || fullName) {
          await tx.account.update({
            where: { id: userId },
            data: {
              username: username ?? account.username,
              profile: {
                upsert: {
                  update: {
                    email: email ?? account.profile?.email,
                    fullName: fullName ?? account.profile?.fullName,
                  },
                  create: {
                    email: email ?? "",
                    fullName: fullName ?? "",
                  },
                },
              },
            },
          });
        }

        if (currentPassword && newPassword) {
          const isPasswordValid = await compare(currentPassword, account.password);
          if (!isPasswordValid) {
            throw new Error("Invalid current password");
          }

          await tx.account.update({
            where: { id: userId },
            data: {
              password: await hash(newPassword, 10),
            },
          });
        }

        if (typeof newsletter === "boolean" || typeof updates === "boolean" || (email && newsletter)) {
          await tx.notification.upsert({
            where: { accountId: userId },
            update: { isNewsletterEnabled: newsletter, isUpdatesEnabled: updates },
            create: { isNewsletterEnabled: newsletter, isUpdatesEnabled: updates, accountId: userId },
          });

          if (email && newsletter) {
            await tx.emailSubscription.upsert({
              where: { accountId: userId },
              update: { address: email, unsubscribe: !newsletter },
              create: { address: email, accountId: userId },
            });
          }
        }
      },
      {
        maxWait: 5000,
        timeout: 10000,
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );
    return sendResponse(res, { success: true, data: accountSettings });
  } catch (error) {
    next(error);
  }
};
