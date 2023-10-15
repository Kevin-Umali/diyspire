import express from "express";
import zodValidateMiddleware from "../middleware/schema-validate";
import { getAllGuidePaths, getHowToGuideByPath } from "../controllers/guide.controller";
import { GetHowToGuideByPathParamsSchema, GetHowToGuideByPathQuerySchema } from "../schema/guide.schema";

const router = express.Router();

router.get("/:path", zodValidateMiddleware({ params: GetHowToGuideByPathParamsSchema, query: GetHowToGuideByPathQuerySchema }), getHowToGuideByPath);
router.get("", getAllGuidePaths);

export default router;
