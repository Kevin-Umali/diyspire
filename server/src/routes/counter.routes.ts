import express from "express";
import { getTotalCountOfGeneratedIdea, incrementCounterOfGeneratedIdea } from "../controllers/counter.controller";
import { authenticateToken } from "../middleware/authenticate-token";
import zodValidateMiddleware from "../middleware/schema-validate";

const router = express.Router();

router.get("", zodValidateMiddleware({}), getTotalCountOfGeneratedIdea);
router.post("", authenticateToken, zodValidateMiddleware({}), incrementCounterOfGeneratedIdea);

export default router;
