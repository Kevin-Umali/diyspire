import express from "express";
import openaiRoutes from "./openai";
import unsplashRoutes from "./unsplash";

const router = express.Router();

router.use("/generate", openaiRoutes);
router.use("/image", unsplashRoutes);

export default router;
