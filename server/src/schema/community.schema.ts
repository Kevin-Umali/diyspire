import { z } from "zod";
import { createNonRequiredString, createRequiredString } from "../utils";

export const CommunityGeneratedIdeaSchema = z.object({
  limit: createNonRequiredString().optional(),
  page: createNonRequiredString().optional(),
  orderBy: z.enum(["asc", "desc"]).optional(),
});

export type CommunityGeneratedIdeaRequest = z.infer<typeof CommunityGeneratedIdeaSchema>;

export const ProjectBySlugQuerySchema = z.object({
  onlyMetadata: z.enum(["true", "false"]).optional().default("false"),
});

export const ProjectBySlugParamsSchema = z.object({
  slug: createRequiredString("Invalid slug provided for project slug"),
});

export type ProjectBySlugQueryRequest = z.infer<typeof ProjectBySlugQuerySchema>;
export type ProjectBySlugParamsRequest = z.infer<typeof ProjectBySlugParamsSchema>;
