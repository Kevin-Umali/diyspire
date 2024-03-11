import express from "express";
import { getProjectById, saveProject } from "../controllers/share.controller";
import { authenticateToken } from "../middleware/authenticate-token";
import zodValidateMiddleware from "../middleware/schema-validate";
import { GetProjectByIdParamsSchema, GetProjectByIdQuerySchema, ShareProjectSchema } from "../schema/share.schema";

const router = express.Router();

router.get("/:id", zodValidateMiddleware({ params: GetProjectByIdParamsSchema, query: GetProjectByIdQuerySchema }), getProjectById);
router.post("", authenticateToken, zodValidateMiddleware({ body: ShareProjectSchema }), saveProject);

export default router;
