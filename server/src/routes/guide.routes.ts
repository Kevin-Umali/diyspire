import express from "express";
import { getAllGuidePaths, getHowToGuideByPath } from "../controllers/guide.controller";
import unifiedConditionalCache from "../middleware/cache-response";
import zodValidateMiddleware from "../middleware/schema-validate";
import { GetHowToGuideByPathParamsSchema, GetHowToGuideByPathQuerySchema } from "../schema/guide.schema";

const router = express.Router();

router.get("/:path", unifiedConditionalCache(24 * 24 * 60 * 60), zodValidateMiddleware({ params: GetHowToGuideByPathParamsSchema, query: GetHowToGuideByPathQuerySchema }), getHowToGuideByPath);
router.get("", unifiedConditionalCache(24 * 24 * 60 * 60), zodValidateMiddleware({}), getAllGuidePaths);

export default router;
