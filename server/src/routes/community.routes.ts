import express from "express";
import { getCommunityGeneratedIdea, getProjectBySlug } from "../controllers/community.controller";
import unifiedConditionalCacheMiddleware from "../middleware/cache-response";
import zodValidateMiddleware from "../middleware/schema-validate";
import { CommunityGeneratedIdeaSchema, ProjectBySlugParamsSchema, ProjectBySlugQuerySchema } from "../schema/community.schema";

const router = express.Router();

router.get("", unifiedConditionalCacheMiddleware(24 * 24 * 60 * 60), zodValidateMiddleware({ query: CommunityGeneratedIdeaSchema }), getCommunityGeneratedIdea);
router.get("/:slug", unifiedConditionalCacheMiddleware(1 * 24 * 60 * 60), zodValidateMiddleware({ params: ProjectBySlugParamsSchema, query: ProjectBySlugQuerySchema }), getProjectBySlug);

export default router;
