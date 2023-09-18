import { Request, Response, NextFunction } from "express";
import { sendSuccess } from "../utils/response-template";
import { PrismaClient } from "@prisma/client";

export const getProjectById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;

    const prisma = req.app.get("prisma") as PrismaClient;

    const project = await prisma.projectShareLink.findUnique({
      where: {
        id: id,
      },
    });

    if (!project) {
      sendSuccess(res, { message: "Project not found." }, 404);
      return;
    }

    return sendSuccess(res, project);
  } catch (error) {
    next(error);
  }
};

export const saveProject = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const prisma = req.app.get("prisma") as PrismaClient;

    const { projectDetails, projectImage, explanation } = req.body;

    const savedProject = await prisma.projectShareLink.create({
      data: {
        projectDetails,
        projectImage,
        explanation,
      },
    });

    if (!savedProject) {
      sendSuccess(res, { message: "Failed to save the project." }, 500);
      return;
    }

    return sendSuccess(res, { id: savedProject.id });
  } catch (error) {
    next(error);
  }
};
