import { Request, Response, NextFunction } from "express";
import { sendError, sendSuccess } from "../utils/response-template";
import { PrismaClient } from "@prisma/client";
import { QueryParamsRequest } from "../middleware/schema-validate";
import { GetHowToGuideByPathParamsRequest, GetHowToGuideByPathQueryRequest } from "../schema/guide.schema";

export async function getHowToGuideByPath(req: QueryParamsRequest<GetHowToGuideByPathQueryRequest, GetHowToGuideByPathParamsRequest>, res: Response, next: NextFunction) {
  try {
    const path = req.params.path;
    const { onlyMetadata = "false" } = req.query;

    const prisma: PrismaClient = req.app.get("prisma");

    if (onlyMetadata === "true") {
      const guideMetadata = await prisma.howToGuide.findUnique({
        where: {
          path: path,
        },
        select: {
          path: true,
          metadata: true,
        },
      });

      if (!guideMetadata?.metadata) {
        sendError(res, "Metadata not found.", 404);
        return;
      }

      return sendSuccess(res, guideMetadata);
    }

    const guide = await prisma.howToGuide.findUnique({
      where: {
        path: path,
      },
      include: {
        metadata: true,
      },
    });

    if (!guide) {
      sendError(res, "How To Guide not found.", 404);
      return;
    }

    return sendSuccess(res, guide);
  } catch (error) {
    next(error);
  }
}

export async function getAllGuidePaths(req: Request, res: Response, next: NextFunction) {
  try {
    const prisma: PrismaClient = req.app.get("prisma");

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
      sendError(res, "No How To Guides found.", 404);
      return;
    }

    return sendSuccess(res, paths);
  } catch (error) {
    next(error);
  }
}
