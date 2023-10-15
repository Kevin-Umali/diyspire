import { z } from "zod";
import { createNonRequiredString } from "../utils";

export const CommunityGeneratedIdeaSchema = z.object({
  limit: createNonRequiredString().optional(),
  orderBy: z.enum(["asc", "desc"]).optional(),
});

export type CommunityGeneratedIdeaRequest = z.infer<typeof CommunityGeneratedIdeaSchema>;
