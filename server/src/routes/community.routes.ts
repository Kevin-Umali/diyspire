import express from "express";
import { getCommunityGeneratedIdea, getProjectBySlug } from "../controllers/community.controller";
import unifiedConditionalCache from "../middleware/cache-response";
import zodValidateMiddleware from "../middleware/schema-validate";
import { CommunityGeneratedIdeaSchema, ProjectBySlugParamsSchema, ProjectBySlugQuerySchema } from "../schema/community.schema";

const router = express.Router();

router.get("", unifiedConditionalCache(24 * 24 * 60 * 60), zodValidateMiddleware({ query: CommunityGeneratedIdeaSchema }), getCommunityGeneratedIdea);
router.get("/:slug", unifiedConditionalCache(1 * 24 * 60 * 60), zodValidateMiddleware({ params: ProjectBySlugParamsSchema, query: ProjectBySlugQuerySchema }), getProjectBySlug);

export default router;
