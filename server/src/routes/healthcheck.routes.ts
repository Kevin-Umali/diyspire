import express from "express";
import zodValidateMiddleware from "../middleware/schema-validate";
import { healthCheck } from "../controllers/healthcheck.controller";

const router = express.Router();

router.get("", zodValidateMiddleware({}), healthCheck);

export default router;
