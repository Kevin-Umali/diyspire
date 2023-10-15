import { z } from "zod";
import { createRequiredString } from "../utils";

export const GetHowToGuideByPathParamsSchema = z.object({
  path: createRequiredString("Path is required"),
});

export const GetHowToGuideByPathQuerySchema = z.object({
  onlyMetadata: z.enum(["true", "false"]).optional().default("false"),
});

export type GetHowToGuideByPathParamsRequest = z.infer<typeof GetHowToGuideByPathParamsSchema>;
export type GetHowToGuideByPathQueryRequest = z.infer<typeof GetHowToGuideByPathQuerySchema>;
