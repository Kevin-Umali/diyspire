import { z } from "zod";
import { createRequiredArray, createRequiredString, createRequiredUUIDString } from "../utils";

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
  materials: createRequiredArray("Materials array cannot be empty"),
  tools: createRequiredArray("Tools array cannot be empty"),
  time: createRequiredString("Time is required"),
  budget: createRequiredString("Budget is required"),
  tags: createRequiredArray("Tags array cannot be empty"),
  description: createRequiredString("Description is required"),
});

export const ShareProjectSchema = z.object({
  projectDetails: ProjectDetailsSchema,
  projectImage: ProjectImageSchema,
  explanation: createRequiredString("Explanation is required"),
});

export type ShareProjectBodyRequest = z.infer<typeof ShareProjectSchema>;

export const GetProjectByIdQuerySchema = z.object({
  onlyMetadata: z.enum(["true", "false"]).optional().default("false"),
});

export const GetProjectByIdParamsSchema = z.object({
  id: createRequiredUUIDString("Invalid UUID provided for project id"),
});

export type GetProjectByIdQueryRequest = z.infer<typeof GetProjectByIdQuerySchema>;
export type GetProjectByIdParamsRequest = z.infer<typeof GetProjectByIdParamsSchema>;
