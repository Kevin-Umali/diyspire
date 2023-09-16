import { Request, Response, NextFunction } from "express";
import { sendSuccess } from "../utils/response-template";
import { PrismaClient } from "@prisma/client";

export async function getHowToGuideByPath(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const path = req.params.path;

    const prisma = req.app.get("prisma") as PrismaClient;

    const guide = await prisma.howToGuide.findUnique({
      where: {
        path: path,
      },
      include: {
        metadata: true,
      },
    });

    if (!guide) {
      sendSuccess(res, { message: "How To Guide not found." }, 404);
      return;
    }

    return sendSuccess(res, guide);
  } catch (error) {
    next(error);
  }
}

export async function getAllGuidePaths(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const prisma = req.app.get("prisma") as PrismaClient;

    const paths = await prisma.howToGuide.findMany({
      select: {
        path: true,
        metadata: {
          select: {
            title: true,
          },
        },
      },
    });

    if (!paths || paths.length === 0) {
      sendSuccess(res, { message: "No How To Guides found." }, 404);
      return;
    }

    return sendSuccess(res, paths);
  } catch (error) {
    next(error);
  }
}
