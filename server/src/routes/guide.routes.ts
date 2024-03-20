import express from "express";
import { getAllGuidePaths, getHowToGuideByPath } from "../controllers/guide.controller";
import unifiedConditionalCacheMiddleware from "../middleware/cache-response";
import zodValidateMiddleware from "../middleware/schema-validate";
import { GetHowToGuideByPathParamsSchema, GetHowToGuideByPathQuerySchema } from "../schema/guide.schema";

const router = express.Router();

router.get(
  "/:path",
  unifiedConditionalCacheMiddleware(24 * 24 * 60 * 60),
  zodValidateMiddleware({ params: GetHowToGuideByPathParamsSchema, query: GetHowToGuideByPathQuerySchema }),
  getHowToGuideByPath,
);
router.get("", unifiedConditionalCacheMiddleware(24 * 24 * 60 * 60), zodValidateMiddleware({}), getAllGuidePaths);

export default router;
