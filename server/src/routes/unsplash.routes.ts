import express from "express";
import zodValidateMiddleware from "../middleware/schema-validate";
import { searchImages } from "../controllers/unsplash.controller";
import { UnsplashImageSearchSchema } from "../schema/unsplash.schema";
import { authenticateToken } from "../middleware/authenticate-token";

const router = express.Router();

router.get("/search", authenticateToken, zodValidateMiddleware({ query: UnsplashImageSearchSchema }), searchImages);

export default router;
