import express from "express";
import {
  getAllGuidePaths,
  getHowToGuideByPath,
} from "../controllers/guide.controller";

const router = express.Router();

router.get("/:path", getHowToGuideByPath);
router.get("", getAllGuidePaths);

export default router;
