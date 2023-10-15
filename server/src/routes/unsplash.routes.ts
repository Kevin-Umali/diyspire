import express from "express";
import zodValidateMiddleware from "../middleware/schema-validate";
import { searchImages } from "../controllers/unsplash.controller";
import { UnsplashImageSearchSchema } from "../schema/unsplash.schema";

const router = express.Router();

router.get("/search", zodValidateMiddleware({ query: UnsplashImageSearchSchema }), searchImages);

export default router;
