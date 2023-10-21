import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { sendError, sendSuccess } from "../utils/response-template";
import { compare, hash } from "bcrypt";
import { generateTokens, refreshTokenExpiry } from "../utils/generate-tokens";
import { BodyRequest } from "../middleware/schema-validate";
import { UserRequest } from "../schema/authentication.schema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtPayload, TokenExpiredError, verify } from "jsonwebtoken";

export const authorizeUser = async (req: BodyRequest<UserRequest>, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;

    const prisma = req.app.get("prisma") as PrismaClient;

    const user = await prisma.users.findUnique({
      where: {
        username,
      },
    });

    if (!user || !(await compare(password, user.password))) {
      sendError(res, "Invalid credentials", 400);
      return;
    }

    if (user.banned) {
      sendError(res, "User is banned.", 401);
      return;
    }

    const { accessToken, refreshToken } = generateTokens(user.id, user.username);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        user: { connect: { id: user.id } },
        deviceInfo: {
          create: {
            isMobile: req.useragent?.isMobile ?? false,
            isDesktop: req.useragent?.isDesktop ?? false,
            isBot: req.useragent?.isBot ?? false,
            browser: req.useragent?.browser ?? "Unknown",
            version: req.useragent?.version ?? "Unknown",
            os: req.useragent?.os ?? "Unknown",
            platform: req.useragent?.platform ?? "Unknown",
          },
        },
        expiresAt: refreshTokenExpiry,
      },
    });

    res.cookie("refreshToken", refreshToken, {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      signed: true,
      sameSite: "lax",
      expires: refreshTokenExpiry,
    });

    return sendSuccess(res, { id: user.id, username: user.username, accessToken });
  } catch (error) {
    next(error);
  }
};

export const registerUser = async (req: BodyRequest<UserRequest>, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;

    const prisma = req.app.get("prisma") as PrismaClient;

    const hashedPassword = await hash(password, 10);

    await prisma.users.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    return sendSuccess(res, { message: "User registered successfully! Please log in." }, 201);
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
      return sendError(res, "Username already exists.", 400);
    } else {
      next(error);
    }
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.signedCookies.refreshToken || req.cookies.refreshToken;

    if (!refreshToken) {
      res.clearCookie("refreshToken");

      sendError(res, "Refresh token is required", 400);
      return;
    }

    const prisma = req.app.get("prisma") as PrismaClient;

    const decoded = verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY!) as JwtPayload;

    const refreshTokenInDb = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: {
        user: true,
      },
    });

    if (!refreshTokenInDb || refreshTokenInDb.userId !== decoded.id || refreshTokenInDb.user.username !== decoded.username) {
      res.clearCookie("refreshToken");

      sendError(res, "Invalid refresh token.", 401);
      return;
    }

    if (new Date(refreshTokenInDb.expiresAt) < new Date() || refreshTokenInDb.user.banned) {
      await prisma.refreshToken.delete({
        where: { token: refreshToken },
      });

      res.clearCookie("refreshToken");

      const errorMessage = refreshTokenInDb.user.banned ? "User is banned." : "Refresh token has expired.";
      sendError(res, errorMessage, 401);
      return;
    }

    const { accessToken } = generateTokens(decoded.id, decoded.username);

    res.cookie("refreshToken", refreshTokenInDb.token, {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "none",
      path: "/",
      expires: refreshTokenInDb.expiresAt,
    });

    return sendSuccess(res, { id: refreshTokenInDb.user.id, username: refreshTokenInDb.user.username, accessToken });
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      res.clearCookie("refreshToken");
      return sendError(res, "Refresh token has expired. Please re-login.", 401);
    }

    if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
      return sendError(res, "Token issue. Please re-login.", 401);
    }
    next(error);
  }
};

export const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.signedCookies.refreshToken || req.cookies.refreshToken;

    const prisma = req.app.get("prisma") as PrismaClient;

    if (refreshToken) {
      await prisma.refreshToken.delete({
        where: { token: refreshToken },
      });
    }

    res.clearCookie("refreshToken");

    return sendSuccess(res, { message: "Logged out successfully." });
  } catch (error) {
    next(error);
  }
};
