import { Response, NextFunction } from "express";
import { sendSuccess } from "../utils/response-template";
import { PrismaClient } from "@prisma/client";
import { parsePrisma } from "../utils";
import { BodyRequest, QueryParamsRequest } from "../middleware/schema-validate";
import { GetProjectByIdParamsRequest, GetProjectByIdQueryRequest, ShareProjectBodyRequest } from "../schema/share.schema";

export const getProjectById = async (req: QueryParamsRequest<GetProjectByIdQueryRequest, GetProjectByIdParamsRequest>, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const onlyMetadata = req.query.onlyMetadata;

    const prisma = req.app.get("prisma") as PrismaClient;

    if (onlyMetadata === "true") {
      const projectDetail = await prisma.projectShareLink.findUnique({
        where: {
          id: id,
        },
        select: {
          projectDetails: true,
        },
      });

      if (!projectDetail?.projectDetails) {
        sendSuccess(res, { message: "Metadata not found." }, 404);
        return;
      }

      const { title, description, tags } = parsePrisma<{ title: string; description: string; tags: string[] }>(projectDetail.projectDetails);
      return sendSuccess(res, { title, description, tags });
    }

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

export const saveProject = async (req: BodyRequest<ShareProjectBodyRequest>, res: Response, next: NextFunction) => {
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

    return sendSuccess(res, { id: savedProject.id }, 201);
  } catch (error) {
    next(error);
  }
};
