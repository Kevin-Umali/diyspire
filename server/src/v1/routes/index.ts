import express from "express";
import openaiRoutes from "./openai";

const router = express.Router();

router.use("/generate", openaiRoutes);

export default router;
