import express from "express";
import { getAllGuidePaths, getHowToGuideByPath } from "../controllers/guide.controller";
import zodValidateMiddleware from "../middleware/schema-validate";
import { GetHowToGuideByPathParamsSchema, GetHowToGuideByPathQuerySchema } from "../schema/guide.schema";

const router = express.Router();

router.get("/:path", zodValidateMiddleware({ params: GetHowToGuideByPathParamsSchema, query: GetHowToGuideByPathQuerySchema }), getHowToGuideByPath);
router.get("", zodValidateMiddleware({}), getAllGuidePaths);

export default router;
