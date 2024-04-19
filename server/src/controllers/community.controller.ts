import { NextFunction, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { QueryParamsRequest, QueryRequest } from "../middleware/schema-validate";
import { CommunityGeneratedIdeaRequest, ProjectBySlugParamsRequest, ProjectBySlugQueryRequest } from "../schema/community.schema";
import { validateQueryFilter } from "../utils";
import sendResponse from "../utils/response-template";

export const getCommunityGeneratedIdea = async (req: QueryRequest<CommunityGeneratedIdeaRequest>, res: Response, next: NextFunction) => {
  try {
    const { page, limit, sortBy, onlySlug } = req.query;

    const { validOffset, validLimit, validSortBy } = validateQueryFilter(page, limit, sortBy);

    const prisma = req.app.get("prisma") as PrismaClient;

    const [projects, count] = await Promise.allSettled([
      prisma.project.findMany({
        select: {
          id: true,
          slug: true,
          projectDetails: true,
          projectImage: {
            select: {
              alt_description: true,
              urls: true,
            },
          },
          createdAt: true,
          accountProjects: {
            select: {
              account: {
                select: {
                  id: true,
                  username: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: validSortBy,
        },
        take: validLimit,
        skip: validOffset,
      }),
      prisma.project.count(),
    ]);

    const projectsResult = projects.status === "fulfilled" ? projects.value : [];
    const totalCountResult = count.status === "fulfilled" ? count.value : 0;

    if (projectsResult.length <= 0) {
      return sendResponse(res, { success: false, error: "No community project exist" }, 404);
    }

    const transformedProjects = projectsResult.map((project) =>
      onlySlug === "true"
        ? { slug: project.slug }
        : {
            id: project.id,
            slug: project.slug,
            title: project.projectDetails.title,
            description: project.projectDetails.description,
            tags: project.projectDetails.tags,
            projectImage: {
              alt_description: project.projectImage.alt_description,
              urls: project.projectImage.urls,
            },
            createdAt: project.createdAt,
            accounts: project.accountProjects.map((ap) => ({
              id: ap.account.id,
              username: ap.account.username,
            })),
          },
    );

    return sendResponse(res, { success: true, data: { projects: transformedProjects, totalCount: totalCountResult } });
  } catch (error) {
    next(error);
  }
};

export const getProjectBySlug = async (req: QueryParamsRequest<ProjectBySlugQueryRequest, ProjectBySlugParamsRequest>, res: Response, next: NextFunction) => {
  try {
    const slug = req.params.slug;
    const onlyMetadata = req.query.onlyMetadata;

    const prisma: PrismaClient = req.app.get("prisma");

    if (onlyMetadata === "true") {
      const projectDetail = await prisma.project.findUnique({
        where: {
          slug: slug,
        },
        select: {
          projectDetails: {
            select: {
              title: true,
              description: true,
              tags: true,
            },
          },
        },
      });

      if (!projectDetail?.projectDetails) {
        return sendResponse(res, { success: false, error: "Metadata not found." }, 404);
      }

      const { title, description, tags } = projectDetail.projectDetails;

      return sendResponse(res, { success: true, data: { title, description, tags } });
    }

    const project = await prisma.project.findUnique({
      where: {
        slug: slug,
      },
      include: {
        projectDetails: true,
        projectImage: {
          include: {
            urls: true,
            links: true,
            user: true,
          },
        },
        accountProjects: {
          include: {
            account: true,
          },
        },
      },
    });

    if (!project) {
      return sendResponse(res, { success: false, error: "Project not found." }, 404);
    }

    return sendResponse(res, { success: true, data: project });
  } catch (error) {
    next(error);
  }
};
