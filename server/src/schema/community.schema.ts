import { z } from "zod";
import { createNonRequiredString } from "../utils";

export const CommunityGeneratedIdeaSchema = z.object({
  limit: createNonRequiredString().optional().default("1"),
  orderBy: z.enum(["asc", "desc"]).optional().default("asc"),
});

export type CommunityGeneratedIdeaRequest = z.infer<typeof CommunityGeneratedIdeaSchema>;
