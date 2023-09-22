import express from "express";
import { ideaValidationSchema } from "../validators/idea";
import { explainProjectByTitle, generateIdea } from "../controllers/openai.controller";
import { explainValidationSchema } from "../validators/explain";
import validationMiddleware from "../middleware/schema-validation";

const router = express.Router();

router.post("/idea", ideaValidationSchema, validationMiddleware, generateIdea);
router.post("/explain", explainValidationSchema, validationMiddleware, explainProjectByTitle);

export default router;
