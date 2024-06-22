import express from "express";
import { getAccountSettings, updateAccountSettings } from "../controllers/account.controller";
import { authenticateToken } from "../middleware/authenticate-token";
import zodValidateMiddleware from "../middleware/schema-validate";
import { UpdateAccountSettingsSchema } from "../schema/account.schema";

const router = express.Router();

router.get("/", authenticateToken, zodValidateMiddleware({}), getAccountSettings);
router.post("/", authenticateToken, zodValidateMiddleware({ body: UpdateAccountSettingsSchema }), updateAccountSettings);
