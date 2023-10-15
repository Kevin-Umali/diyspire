import { z } from "zod";
import { createNonRequiredString, createRequiredArray, createRequiredString } from "../utils";

export const IdeaSchema = z.object({
  materials: createRequiredArray("Materials should be an array of strings"),
  onlySpecified: z.boolean(),
  difficulty: createRequiredString("Difficulty is required"),
  category: createRequiredString("Category is required"),
  tools: createRequiredArray("Tools should be an array of strings"),
  time: createNonRequiredString(),
  timeUnit: createNonRequiredString().nullable(),
  timeValue: z.number().nonnegative().optional().nullable().default(0),
  budget: createRequiredString("Budget is required"),
  currency: createRequiredString("Currency is required"),
  endPurpose: createRequiredString("End purpose is required"),
});

export type IdeaRequest = z.infer<typeof IdeaSchema>;

export const ExplainSchema = z.object({
  title: createRequiredString("Title is required"),
  materials: createRequiredArray("Materials should be an array of strings and cannot be empty"),
  tools: createRequiredArray("Tools should be an array of strings and cannot be empty"),
  time: createNonRequiredString(),
  budget: createRequiredString("Budget is required"),
  description: createRequiredString("Description is required"),
});

export type ExplainRequest = z.infer<typeof ExplainSchema>;
