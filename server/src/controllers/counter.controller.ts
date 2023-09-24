import { Request, Response, NextFunction } from "express";
import { sendSuccess } from "../utils/response-template";
import { PrismaClient } from "@prisma/client";
import { getStartOfDay } from "../utils";

export const getTotalCountOfGeneratedIdea = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const prisma = req.app.get("prisma") as PrismaClient;

    const totalCount = await prisma.ideaGenerationCounter.aggregate({
      _sum: {
        count: true,
      },
    });

    return sendSuccess(res, { totalCount: totalCount._sum.count ?? 0 });
  } catch (error) {
    next(error);
  }
};

export const incrementCounterOfGeneratedIdea = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const prisma = req.app.get("prisma") as PrismaClient;

    const today = getStartOfDay(new Date());

    const counter = await prisma.ideaGenerationCounter.findFirst({
      where: {
        createdAt: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      },
    });

    if (counter) {
      await prisma.ideaGenerationCounter.update({
        where: {
          id: counter.id,
        },
        data: {
          count: {
            increment: 1,
          },
        },
      });
    } else {
      await prisma.ideaGenerationCounter.create({
        data: {
          count: 1,
          createdAt: today,
        },
      });
    }

    return sendSuccess(res, {}, 201);
  } catch (error) {
    next(error);
  }
};
