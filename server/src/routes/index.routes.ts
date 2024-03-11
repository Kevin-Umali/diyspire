import express from "express";
import authenticationRoutes from "./authentication.routes";
import communityRoutes from "./community.routes";
import counterRoutes from "./counter.routes";
import emailRoutes from "./email.routes";
import guideRoutes from "./guide.routes";
import healthcheckRoutes from "./healthcheck.routes";
import openaiRoutes from "./openai.routes";
import shareRoutes from "./share.routes";
import unsplashRoutes from "./unsplash.routes";

const router = express.Router();

router.use("/generate", openaiRoutes);
router.use("/image", unsplashRoutes);
router.use("/guide", guideRoutes);
router.use("/share", shareRoutes);
router.use("/counter", counterRoutes);
router.use("/community", communityRoutes);
router.use("/auth", authenticationRoutes);
router.use("/healthcheck", healthcheckRoutes);
router.use("/email", emailRoutes);

export { openaiRoutes, unsplashRoutes, guideRoutes, shareRoutes, counterRoutes, communityRoutes, authenticationRoutes, healthcheckRoutes, emailRoutes };
