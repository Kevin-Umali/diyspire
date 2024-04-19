import express from "express";
import { getProjectByAccountId, getProjectById, saveProject } from "../controllers/project.controller";
import { authenticateToken } from "../middleware/authenticate-token";
import unifiedConditionalCacheMiddleware from "../middleware/cache-response";
import zodValidateMiddleware from "../middleware/schema-validate";
import { ProjectByAccountIdSchema, ProjectByIdParamsSchema, ProjectByIdQuerySchema, ProjectSchema } from "../schema/project.schema";

const router = express.Router();

router.post("", authenticateToken, zodValidateMiddleware({ body: ProjectSchema }), saveProject);
router.get("/:id", authenticateToken, unifiedConditionalCacheMiddleware(1 * 24 * 60 * 60), zodValidateMiddleware({ params: ProjectByIdParamsSchema, query: ProjectByIdQuerySchema }), getProjectById);
router.get("", authenticateToken, zodValidateMiddleware({ query: ProjectByAccountIdSchema }), getProjectByAccountId);

export default router;
