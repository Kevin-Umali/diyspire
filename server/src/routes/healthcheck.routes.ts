import express from "express";
import { healthCheck } from "../controllers/healthcheck.controller";
import zodValidateMiddleware from "../middleware/schema-validate";

const router = express.Router();

router.get("", zodValidateMiddleware({}), healthCheck);

export default router;
