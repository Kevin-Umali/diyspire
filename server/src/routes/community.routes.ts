import express from "express";
import { getCommunityGeneratedIdea } from "../controllers/community.controller";
import zodValidateMiddleware from "../middleware/schema-validate";
import { CommunityGeneratedIdeaSchema } from "../schema/community.schema";

const router = express.Router();

router.get("", zodValidateMiddleware({ query: CommunityGeneratedIdeaSchema }), getCommunityGeneratedIdea);

export default router;
