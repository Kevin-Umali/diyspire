import express from "express";
import { explainProjectByTitle, generateIdea } from "../controllers/openai.controller";
import { authenticateToken } from "../middleware/authenticate-token";
import zodValidateMiddleware from "../middleware/schema-validate";
import { ExplainSchema, IdeaSchema } from "../schema/openai.schema";

const router = express.Router();

router.post("/idea", authenticateToken, zodValidateMiddleware({ body: IdeaSchema }), generateIdea);
router.post("/explain", authenticateToken, zodValidateMiddleware({ body: ExplainSchema }), explainProjectByTitle);

export default router;
