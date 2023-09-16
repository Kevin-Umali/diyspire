import express from "express";
import { searchValidationSchema } from "../validators/image-search";
import { searchImages } from "../controllers/unsplash.controller";

const router = express.Router();

router.get("/search", searchValidationSchema, searchImages);

export default router;
