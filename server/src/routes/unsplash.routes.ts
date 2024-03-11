import express from "express";
import { searchImages } from "../controllers/unsplash.controller";
import { authenticateToken } from "../middleware/authenticate-token";
import zodValidateMiddleware from "../middleware/schema-validate";
import { UnsplashImageSearchSchema } from "../schema/unsplash.schema";

const router = express.Router();

router.get("/search", authenticateToken, zodValidateMiddleware({ query: UnsplashImageSearchSchema }), searchImages);

export default router;
