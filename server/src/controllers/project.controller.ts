import { NextFunction, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import { BodyRequest, QueryParamsRequest, QueryRequest } from "../middleware/schema-validate";
import { ProjectBodyRequest, ProjectByAccountIdRequest, ProjectByIdParamsRequest, ProjectByIdQueryRequest } from "../schema/project.schema";
import { validateQueryFilter } from "../utils";
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

        const existingProject = await tx.projectDetails.findFirst({
          where: { project: { projectDetails: { title: projectDetails.title } } },
          include: {
            project: true,
          },
        });

        let projectId = "";

        if (existingProject?.project) {
          projectId = existingProject.project.id;
          slug = existingProject.project.slug ?? slug;
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

export const getProjectByAccountId = async (req: QueryRequest<ProjectByAccountIdRequest>, res: Response, next: NextFunction) => {
  try {
    const { page, limit, orderBy, sortBy, search, filter } = req.query;
    const { validOffset, validLimit, validSortBy } = validateQueryFilter(page, limit, sortBy);
    const accountId = req.user?.id;
    const filterArray = filter ? filter.split(",") : [];

    const prisma: PrismaClient = req.app.get("prisma");

    let whereCondition: Prisma.AccountProjectsWhereInput = { accountId: accountId };

    if (search && filterArray.length > 0) {
      const filterValues: (Prisma.ProjectWhereInput | undefined)[] = filterArray
        .map((value): Prisma.ProjectWhereInput | undefined => {
          if (value === "title") {
            return {
              projectDetails: {
                title: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            };
          } else if (value === "materials" || value === "tools") {
            return {
              projectDetails: {
                [value]: {
                  hasSome: [search],
                },
              },
            };
          }

          return undefined;
        })
        .filter(Boolean);

      if (filterValues.length > 0) {
        whereCondition = {
          ...whereCondition,
          project: {
            OR: filterValues as Prisma.ProjectWhereInput[],
          },
        };
      }
    }

    const [projects, count] = await Promise.allSettled([
      prisma.accountProjects.findMany({
        where: whereCondition,
        select: {
          projectId: true,
          project: {
            select: {
              id: true,
              slug: true,
              projectImage: {
                select: {
                  urls: true,
                  user: true,
                },
              },
              projectDetails: {
                select: {
                  title: true,
                  materials: true,
                  tools: true,
                  time: true,
                  budget: true,
                  tags: true,
                },
              },
              createdAt: true,
            },
          },
        },
        orderBy: {
          project: orderBy === "createdAt" || !orderBy ? { createdAt: validSortBy } : { projectDetails: { [orderBy]: validSortBy } },
        },
        take: validLimit,
        skip: validOffset,
      }),
      prisma.accountProjects.count({ where: whereCondition }),
    ]);

    const projectsData = projects.status === "fulfilled" ? projects.value : [];
    const projectsCount = count.status === "fulfilled" ? count.value : 0;

    if (projectsData.length <= 0) {
      return sendResponse(res, { success: true, data: [] });
    }

    return sendResponse(res, { success: true, data: { projects: projectsData, totalCount: projectsCount } });
  } catch (error) {
    next(error);
  }
};
