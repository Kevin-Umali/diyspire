import { Response, NextFunction } from "express";
import { sendSuccess } from "../utils/response-template";
import { PrismaClient } from "@prisma/client";
import { parsePrisma, removeDuplicates, validateQueryFilter } from "../utils";
import { QueryRequest } from "../middleware/schema-validate";
import { CommunityGeneratedIdeaRequest } from "../schema/community.schema";

export const getCommunityGeneratedIdea = async (req: QueryRequest<CommunityGeneratedIdeaRequest>, res: Response, next: NextFunction) => {
  try {
    const { limit, orderBy } = req.query;

    const { validLimit, validOrderBy } = validateQueryFilter(limit, orderBy);

    const prisma = req.app.get("prisma") as PrismaClient;

    const projects = await prisma.projectShareLink.findMany({
      select: {
        id: true,
        projectDetails: true,
        projectImage: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: validOrderBy,
      },
      take: validLimit,
    });

    if (projects.length <= 0) {
      sendSuccess(res, { message: "No community project exist" }, 404);
      return;
    }

    const formattedProject = projects.map(({ id, projectDetails, projectImage, createdAt }) => {
      const { urls, alt_description } = parsePrisma<{
        urls: {
          raw: string;
          full: string;
          small: string;
          thumb: string;
          regular: string;
          small_s3: string;
        };
        alt_description: string;
      }>(projectImage);
      const { title, description, tags } = parsePrisma<{
        title: string;
        description: string;
        tags: string[];
      }>(projectDetails);

      return {
        id,
        title,
        description,
        tags,
        projectImage: {
          urls,
          alt_description,
        },
        createdAt,
      };
    });

    return sendSuccess(res, removeDuplicates(formattedProject, ["title"]));
  } catch (error) {
    next(error);
  }
};
