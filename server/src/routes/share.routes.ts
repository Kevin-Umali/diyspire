import express from "express";
import zodValidateMiddleware from "../middleware/schema-validate";
import { getProjectById, saveProject } from "../controllers/share.controller";
import { GetProjectByIdParamsSchema, GetProjectByIdQuerySchema, ShareProjectSchema } from "../schema/share.schema";

const router = express.Router();

router.get("/:id", zodValidateMiddleware({ params: GetProjectByIdParamsSchema, query: GetProjectByIdQuerySchema }), getProjectById);
router.post("", zodValidateMiddleware({ body: ShareProjectSchema }), saveProject);

export default router;
