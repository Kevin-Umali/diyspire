import express from "express";
import { explainProjectByTitle, generateIdea } from "../controllers/openai.controller";
import { authenticateToken } from "../middleware/authenticate-token";
import unifiedConditionalCacheMiddleware from "../middleware/cache-response";
import zodValidateMiddleware from "../middleware/schema-validate";
import { ExplainSchema, IdeaSchema } from "../schema/openai.schema";

const router = express.Router();

router.post("/idea", authenticateToken, unifiedConditionalCacheMiddleware(2 * 60 * 60), zodValidateMiddleware({ body: IdeaSchema }), generateIdea);
router.post("/explain", authenticateToken, unifiedConditionalCacheMiddleware(2 * 60 * 60), zodValidateMiddleware({ body: ExplainSchema }), explainProjectByTitle);

export default router;
