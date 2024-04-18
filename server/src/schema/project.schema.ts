import { z } from "zod";
import { createNonRequiredArray, createNonRequiredString, createRequiredString, createRequiredUUIDString } from "../utils";

const UrlsSchema = z.object({
  raw: createRequiredString("Image raw URL is required", { shouldEscape: false }),
  full: createRequiredString("Image full URL is required", { shouldEscape: false }),
  regular: createRequiredString("Image regular URL is required", { shouldEscape: false }),
  small: createRequiredString("Image small URL is required", { shouldEscape: false }),
  thumb: createRequiredString("Image thumb URL is required", { shouldEscape: false }),
  small_s3: createRequiredString("Image small_s3 URL is required", { shouldEscape: false }),
});

const LinksSchema = z.object({
  self: createRequiredString("Image self link is required"),
  html: createRequiredString("Image HTML link is required"),
  download: createRequiredString("Image download link is required"),
  download_location: createRequiredString("Image download location link is required"),
});

const UserSchema = z.object({
  username: createRequiredString("User username is required"),
  name: createRequiredString("User name is required"),
  link: createRequiredString("User link is required", { shouldEscape: false }),
});

const ProjectImageSchema = z.object({
  id: createRequiredString("Image ID is required"),
  width: z.number().int("Image width should be an integer"),
  height: z.number().int("Image height should be an integer"),
  color: createRequiredString("Image color is required"),
  alt_description: createRequiredString("Image alt description is required"),
  urls: UrlsSchema,
  links: LinksSchema,
  user: UserSchema,
});

const ProjectDetailsSchema = z.object({
  title: createRequiredString("Title is required"),
  materials: createNonRequiredArray(),
  tools: createNonRequiredArray(),
  time: createRequiredString("Time is required"),
  budget: createRequiredString("Budget is required"),
  tags: createNonRequiredArray(),
  description: createRequiredString("Description is required"),
});

export const ProjectSchema = z.object({
  projectDetails: ProjectDetailsSchema,
  projectImage: ProjectImageSchema,
  explanation: createRequiredString("Explanation is required"),
});

export type ProjectBodyRequest = z.infer<typeof ProjectSchema>;

export const ProjectByIdQuerySchema = z.object({
  onlyMetadata: z.enum(["true", "false"]).optional().default("false"),
});

export const ProjectByIdParamsSchema = z.object({
  id: createRequiredUUIDString("Invalid UUID provided for project id"),
});

export type ProjectByIdQueryRequest = z.infer<typeof ProjectByIdQuerySchema>;
export type ProjectByIdParamsRequest = z.infer<typeof ProjectByIdParamsSchema>;

export const ProjectByAccountIdSchema = z.object({
  limit: createNonRequiredString().optional(),
  page: createNonRequiredString().optional(),
  sortBy: z.enum(["asc", "desc"]).optional(),
  orderBy: createNonRequiredString().optional(),
  search: createNonRequiredString().optional(),
  filter: createNonRequiredString().optional(),
});

export type ProjectByAccountIdRequest = z.infer<typeof ProjectByAccountIdSchema>;
