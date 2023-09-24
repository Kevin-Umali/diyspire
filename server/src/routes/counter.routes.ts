import express from "express";
import { getTotalCountOfGeneratedIdea, incrementCounterOfGeneratedIdea } from "../controllers/counter.controller";

const router = express.Router();

router.get("", getTotalCountOfGeneratedIdea);
router.post("", incrementCounterOfGeneratedIdea);

export default router;
