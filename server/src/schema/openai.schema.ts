import { z } from "zod";
import { createNonRequiredArray, createNonRequiredString, createRequiredString } from "../utils";

export const IdeaSchema = z.object({
  materials: createNonRequiredArray(),
  onlySpecified: z.boolean(),
  difficulty: createRequiredString("Difficulty is required"),
  category: createRequiredString("Category is required"),
  tools: createNonRequiredArray(),
  timeUnit: createNonRequiredString().nullable(),
  timeValue: z.number().nonnegative().optional().nullable().default(0),
  budget: createRequiredString("Budget is required"),
  currency: createRequiredString("Currency is required"),
  endPurpose: createRequiredString("End purpose is required"),
});

export type IdeaRequest = z.infer<typeof IdeaSchema>;

export const ExplainSchema = z.object({
  title: createRequiredString("Title is required"),
  materials: createNonRequiredArray(),
  tools: createNonRequiredArray(),
  time: createNonRequiredString(),
  budget: createRequiredString("Budget is required"),
  description: createRequiredString("Description is required"),
});

export type ExplainRequest = z.infer<typeof ExplainSchema>;
