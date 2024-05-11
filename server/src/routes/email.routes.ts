import express from "express";
import { sendSubscriberDiyEmail, subscribeEmail, unsubscribeEmail } from "../controllers/email.controller";
import { apiKeyMiddleware } from "../middleware/api-key";
import { authenticateEmailToken } from "../middleware/authenticate-token";
import zodValidateMiddleware from "../middleware/schema-validate";
import { SubscribeEmailSchema, UnsubscribeEmailQuerySchema } from "../schema/email.schema";

const router = express.Router();

router.get("/unsubscribe", authenticateEmailToken, zodValidateMiddleware({ query: UnsubscribeEmailQuerySchema }), unsubscribeEmail);
router.post("/subscribe", zodValidateMiddleware({ body: SubscribeEmailSchema }), subscribeEmail);
router.post("/subscriber/send", apiKeyMiddleware, sendSubscriberDiyEmail);

export default router;
