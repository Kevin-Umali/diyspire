import express from "express";
import { explainProjectByTitle, generateIdea } from "../controllers/openai.controller";
import zodValidateMiddleware from "../middleware/schema-validate";
import { ExplainSchema, IdeaSchema } from "../schema/openai.schema";

const router = express.Router();

router.post("/idea", zodValidateMiddleware({ body: IdeaSchema }), generateIdea);
router.post("/explain", zodValidateMiddleware({ body: ExplainSchema }), explainProjectByTitle);

export default router;
