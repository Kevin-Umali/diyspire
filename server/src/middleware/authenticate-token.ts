import { NextFunction, Request, Response } from "express";
import { JsonWebTokenError, NotBeforeError, TokenExpiredError, verify } from "jsonwebtoken";
import { sendError } from "../utils/response-template";

interface UserPayload {
  id: string;
  username: string;
}

interface EmailPayload {
  id: string;
  email: string;
}

export interface AugmentedRequest extends Request {
  user?: UserPayload;
  email?: EmailPayload;
}

const handleTokenError = (err: any, res: Response) => {
  if (err instanceof TokenExpiredError) {
    sendError(res, "Access Token Expired", 403);
  } else if (err instanceof JsonWebTokenError || err instanceof NotBeforeError) {
    sendError(res, "Invalid Access Token", 403);
  } else {
    sendError(res, "Token Verification Failed", 403);
  }
};

export const authenticateToken = (req: AugmentedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];
  if (!token) {
    sendError(res, "Access Token Required", 401);
    return;
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET_KEY) as UserPayload;
    req.user = decoded;
    next();
  } catch (err) {
    handleTokenError(err, res);
  }
};

export const authenticateEmailToken = (req: AugmentedRequest, res: Response, next: NextFunction) => {
  const token = req.query.token as string;
  if (!token) {
    sendError(res, "Access Token Required", 401);
    return;
  }

  try {
    const decoded = verify(token, process.env.EMAIL_SECRET_KEY) as EmailPayload;
    req.email = decoded;
    next();
  } catch (err) {
    handleTokenError(err, res);
  }
};
