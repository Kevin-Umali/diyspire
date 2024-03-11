import { NextFunction, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import { BodyRequest, QueryParamsRequest } from "../middleware/schema-validate";
import { GetProjectByIdParamsRequest, GetProjectByIdQueryRequest, ShareProjectBodyRequest } from "../schema/share.schema";
import { sendError, sendSuccess } from "../utils/response-template";

export const getProjectById = async (req: QueryParamsRequest<GetProjectByIdQueryRequest, GetProjectByIdParamsRequest>, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const onlyMetadata = req.query.onlyMetadata;

    const prisma: PrismaClient = req.app.get("prisma");

    if (onlyMetadata === "true") {
      const projectDetail = await prisma.projectShareLink.findUnique({
        where: {
          id: id,
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
        sendError(res, "Metadata not found.", 404);
        return;
      }
      const { title, description, tags } = projectDetail.projectDetails;

      return sendSuccess(res, { title, description, tags });
    }

    const project = await prisma.projectShareLink.findUnique({
      where: {
        id: id,
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
      },
    });

    if (!project) {
      sendError(res, "Project not found.", 404);
      return;
    }

    return sendSuccess(res, project);
  } catch (error) {
    next(error);
  }
};

export const saveProject = async (req: BodyRequest<ShareProjectBodyRequest>, res: Response, next: NextFunction) => {
  try {
    const { projectDetails, projectImage, explanation } = req.body;

    const prisma: PrismaClient = req.app.get("prisma");

    const result = await prisma.$transaction(
      async (tx) => {
        const existingProject = await tx.projectDetails.findFirst({
          where: { project: { projectDetails: { title: projectDetails.title } } },
          include: {
            project: true,
          },
        });

        if (existingProject?.project) {
          return existingProject.project.id;
        }

        const existingImage = await tx.projectImage.findUnique({
          where: { id: projectImage.id },
        });
        const imageToUse =
          existingImage ??
          (await tx.projectImage.create({
            data: {
              ...projectImage,
              urls: {
                create: projectImage.urls,
              },
              links: {
                create: projectImage.links,
              },
              user: {
                create: projectImage.user,
              },
            },
          }));

        const createdProject = await tx.projectShareLink.create({
          data: {
            explanation,
            projectDetails: {
              create: projectDetails,
            },
            projectImage: {
              connect: {
                id: imageToUse.id,
              },
            },
          },
          select: {
            id: true,
          },
        });

        return createdProject.id;
      },
      {
        maxWait: 5000,
        timeout: 10000,
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );

    if (!result) {
      sendError(res, "Failed to save the project.", 500);
      return;
    }

    return sendSuccess(res, { id: result }, 201);
  } catch (error) {
    next(error);
  }
};
