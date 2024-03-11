import express from "express";
import { authorizeUser, logoutUser, refreshToken, registerUser } from "../controllers/authentication.controller";
import { authenticateToken } from "../middleware/authenticate-token";
import zodValidateMiddleware from "../middleware/schema-validate";
import { UserSchema } from "../schema/authentication.schema";

const router = express.Router();

router.post("/login", zodValidateMiddleware({ body: UserSchema }), authorizeUser);
router.post("/register", zodValidateMiddleware({ body: UserSchema }), registerUser);
router.post("/refresh", zodValidateMiddleware({}), refreshToken);
router.post("/logout", authenticateToken, zodValidateMiddleware({}), logoutUser);

export default router;
