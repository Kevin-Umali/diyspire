import { Request, Response, NextFunction } from "express";
import { JsonWebTokenError, TokenExpiredError, NotBeforeError, verify } from "jsonwebtoken";
import { sendError } from "../utils/response-template";

interface UserPayload {
  id: string;
  username: string;
}

export interface AugmentedRequest extends Request {
  user?: UserPayload;
}

export const authenticateToken = (req: AugmentedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
      sendError(res, "Access Token Required", 401);
      return;
    }

    const decoded = verify(token, process.env.JWT_SECRET_KEY!) as UserPayload;
    req.user = decoded;
    next();
  } catch (err) {
    if (err instanceof JsonWebTokenError || err instanceof TokenExpiredError || err instanceof NotBeforeError) {
      switch (err.name) {
        case "TokenExpiredError":
          return sendError(res, "Access Token Expired", 403);
        case "JsonWebTokenError":
        case "NotBeforeError":
          return sendError(res, "Invalid Access Token", 403);
        default:
          return sendError(res, "Token Verification Failed", 403);
      }
    }
    next(err);
  }
};
