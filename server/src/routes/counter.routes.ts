import express from "express";
import zodValidateMiddleware from "../middleware/schema-validate";
import { getTotalCountOfGeneratedIdea, incrementCounterOfGeneratedIdea } from "../controllers/counter.controller";
import { authenticateToken } from "../middleware/authenticate-token";

const router = express.Router();

router.get("", zodValidateMiddleware({}), getTotalCountOfGeneratedIdea);
router.post("", authenticateToken, zodValidateMiddleware({}), incrementCounterOfGeneratedIdea);

export default router;
