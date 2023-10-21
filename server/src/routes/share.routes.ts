import express from "express";
import zodValidateMiddleware from "../middleware/schema-validate";
import { getProjectById, saveProject } from "../controllers/share.controller";
import { GetProjectByIdParamsSchema, GetProjectByIdQuerySchema, ShareProjectSchema } from "../schema/share.schema";
import { authenticateToken } from "../middleware/authenticate-token";

const router = express.Router();

router.get("/:id", zodValidateMiddleware({ params: GetProjectByIdParamsSchema, query: GetProjectByIdQuerySchema }), getProjectById);
router.post("", authenticateToken, zodValidateMiddleware({ body: ShareProjectSchema }), saveProject);

export default router;
