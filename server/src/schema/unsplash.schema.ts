import { z } from "zod";
import { createRequiredString } from "../utils";

export const UnsplashImageSearchSchema = z.object({
  query: createRequiredString("Query cannot be empty", { minLength: 1, maxLength: 80 }),
});

export type UnsplashImageSearchQueryRequest = z.infer<typeof UnsplashImageSearchSchema>;
