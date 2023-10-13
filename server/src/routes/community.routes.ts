import express from "express";
import { getCommunityGeneratedIdea } from "../controllers/community.controller";

const router = express.Router();

router.get("", getCommunityGeneratedIdea);

export default router;
