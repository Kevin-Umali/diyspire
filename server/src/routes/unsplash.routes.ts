import express from "express";
import { searchImages } from "../controllers/unsplash.controller";
import { authenticateToken } from "../middleware/authenticate-token";
import unifiedConditionalCacheMiddleware from "../middleware/cache-response";
import zodValidateMiddleware from "../middleware/schema-validate";
import { UnsplashImageSearchSchema } from "../schema/unsplash.schema";

const router = express.Router();

router.get("/search", authenticateToken, unifiedConditionalCacheMiddleware(24 * 24 * 60 * 60), zodValidateMiddleware({ query: UnsplashImageSearchSchema }), searchImages);

export default router;
