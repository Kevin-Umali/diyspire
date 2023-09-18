import express from "express";
import { searchValidationSchema } from "../validators/image-search";
import { searchImages } from "../controllers/unsplash.controller";
import validationMiddleware from "../middleware/schema-validation";

const router = express.Router();

router.get(
  "/search",
  searchValidationSchema,
  validationMiddleware,
  searchImages,
);

export default router;
