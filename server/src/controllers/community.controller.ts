import { NextFunction, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { QueryRequest } from "../middleware/schema-validate";
import { CommunityGeneratedIdeaRequest } from "../schema/community.schema";
import { validateQueryFilter } from "../utils";
import sendResponse from "../utils/response-template";

export const getCommunityGeneratedIdea = async (req: QueryRequest<CommunityGeneratedIdeaRequest>, res: Response, next: NextFunction) => {
  try {
    const { limit, orderBy } = req.query;

    const { validLimit, validOrderBy } = validateQueryFilter(limit, orderBy);

    const prisma = req.app.get("prisma") as PrismaClient;

    const projects = await prisma.projectShareLink.findMany({
      select: {
        id: true,
        projectDetails: true,
        projectImage: {
          select: {
            alt_description: true,
            urls: true,
          },
        },
        createdAt: true,
      },
      orderBy: {
        createdAt: validOrderBy,
      },
      take: validLimit,
    });

    if (projects.length <= 0) {
      return sendResponse(res, { success: false, error: "No community project exist" }, 404);
    }

    const transformedProjects = projects.map((project) => ({
      id: project.id,
      title: project.projectDetails.title,
      description: project.projectDetails.description,
      tags: project.projectDetails.tags,
      projectImage: {
        alt_description: project.projectImage.alt_description,
        urls: project.projectImage.urls,
      },
      createdAt: project.createdAt,
    }));

    return sendResponse(res, { success: true, data: transformedProjects });
  } catch (error) {
    next(error);
  }
};
