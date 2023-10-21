import express from "express";
import zodValidateMiddleware from "../middleware/schema-validate";
import { explainProjectByTitle, generateIdea } from "../controllers/openai.controller";
import { ExplainSchema, IdeaSchema } from "../schema/openai.schema";
import { authenticateToken } from "../middleware/authenticate-token";

const router = express.Router();

router.post("/idea", authenticateToken, zodValidateMiddleware({ body: IdeaSchema }), generateIdea);
router.post("/explain", authenticateToken, zodValidateMiddleware({ body: ExplainSchema }), explainProjectByTitle);

export default router;
