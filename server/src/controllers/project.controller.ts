import { NextFunction, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import { BodyRequest, QueryParamsRequest } from "../middleware/schema-validate";
import { ProjectBodyRequest, ProjectByIdParamsRequest, ProjectByIdQueryRequest } from "../schema/project.schema";
import sendResponse from "../utils/response-template";

export const saveProject = async (req: BodyRequest<ProjectBodyRequest>, res: Response, next: NextFunction) => {
  try {
    const { projectDetails, projectImage, explanation } = req.body;
    const user = req.user;

    const prisma: PrismaClient = req.app.get("prisma");

    const result = await prisma.$transaction(
      async (tx) => {
        const accountId = user?.id;

        if (!accountId) {
          throw new Error("Account ID is undefined.");
        }

        const baseSlug = projectDetails.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .split("-")
          .filter(Boolean)
          .join("-");
        const uniqueSlug = `how-to-make-${baseSlug}`;
        let slug = uniqueSlug;
        let counter = 1;
        while (await tx.project.findUnique({ where: { slug } })) {
          slug = `${uniqueSlug}-${counter}`;
          counter++;
        }

        const existingProject = await tx.projectDetails.findFirst({
          where: { project: { projectDetails: { title: projectDetails.title } } },
          include: {
            project: true,
          },
        });

        let projectId = "";

        if (existingProject?.project) {
          projectId = existingProject.project.id;
        } else {
          const imageToUse = await tx.projectImage.upsert({
            where: {
              id: projectImage.id,
            },
            update: {},
            create: {
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
          });

          const createdProject = await tx.project.create({
            data: {
              slug,
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

          projectId = createdProject.id;
        }

        await tx.accountProjects.upsert({
          where: {
            accountId_projectId: {
              accountId,
              projectId,
            },
          },
          update: {},
          create: {
            accountId,
            projectId,
          },
        });

        return { id: projectId, slug };
      },
      {
        maxWait: 5000,
        timeout: 10000,
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );

    if (!result) {
      sendResponse(res, { success: false, error: "Failed to save the project." });
      return;
    }

    return sendResponse(res, { success: true, data: result }, 201);
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req: QueryParamsRequest<ProjectByIdQueryRequest, ProjectByIdParamsRequest>, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const onlyMetadata = req.query.onlyMetadata;

    const prisma: PrismaClient = req.app.get("prisma");

    if (onlyMetadata === "true") {
      const projectDetail = await prisma.project.findUnique({
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
        return sendResponse(res, { success: false, error: "Metadata not found." }, 404);
      }

      const { title, description, tags } = projectDetail.projectDetails;

      return sendResponse(res, { success: true, data: { title, description, tags } });
    }

    const project = await prisma.project.findUnique({
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
