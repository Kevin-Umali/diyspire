import express from "express";
import { getProjectById, saveProject } from "../controllers/share.controller";
import { shareProjectValidationSchema } from "../validators/share-link";
import validationMiddleware from "../middleware/schema-validation";

const router = express.Router();

router.get("/:id", getProjectById);
router.post(
  "",
  shareProjectValidationSchema,
  validationMiddleware,
  saveProject,
);

export default router;
