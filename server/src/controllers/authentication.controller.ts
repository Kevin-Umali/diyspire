import { compare, hash } from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { JwtPayload, TokenExpiredError, verify } from "jsonwebtoken";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { PrismaClient } from "@prisma/client";
import { BodyRequest } from "../middleware/schema-validate";
import { UserRequest } from "../schema/authentication.schema";
import { generateTokens, refreshTokenExpiry } from "../utils/generate-tokens";
import sendResponse from "../utils/response-template";

export const authorizeUser = async (req: BodyRequest<UserRequest>, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;

    const prisma: PrismaClient = req.app.get("prisma");

    const user = await prisma.users.findUnique({
      where: {
        username,
      },
    });

    if (!user || !(await compare(password, user.password))) {
      return sendResponse(res, { success: false, error: "Invalid credentials" }, 400);
    }

    if (user.banned) {
      return sendResponse(res, { success: false, error: "User is banned." }, 401);
    }

    const { accessToken, refreshToken } = await generateTokens({ options: { id: user.id, username: user.username } });

    await prisma.refreshToken.create({
      data: {
        token: refreshToken!,
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
        expiresAt: refreshTokenExpiry(),
      },
    });

    res.cookie("refreshToken", refreshToken, {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      signed: true,
      sameSite: "none",
      expires: refreshTokenExpiry(),
    });

    return sendResponse(res, { success: true, data: { id: user.id, username: user.username, accessToken } });
  } catch (error) {
    next(error);
  }
};

export const registerUser = async (req: BodyRequest<UserRequest>, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;

    const prisma: PrismaClient = req.app.get("prisma");

    const hashedPassword = await hash(password, 10);

    await prisma.users.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    return sendResponse(res, { success: true, message: "User registered successfully! Please log in." }, 201);
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
      return sendResponse(res, { success: false, error: "Username already exists." }, 400);
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

      return sendResponse(res, { success: false, error: "Refresh token is required" }, 400);
    }

    const prisma: PrismaClient = req.app.get("prisma");

    const decoded = verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY) as JwtPayload;

    const refreshTokenInDb = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: {
        user: true,
      },
    });

    if (!refreshTokenInDb || refreshTokenInDb.userId !== decoded.id || refreshTokenInDb.user.username !== decoded.username) {
      res.clearCookie("refreshToken");

      return sendResponse(res, { success: false, error: "Invalid refresh token." }, 401);
    }

    if (new Date(refreshTokenInDb.expiresAt) < new Date() || refreshTokenInDb.user.banned) {
      await prisma.refreshToken.delete({
        where: { token: refreshToken },
      });

      res.clearCookie("refreshToken");

      const errorMessage = refreshTokenInDb.user.banned ? "User is banned." : "Refresh token has expired.";

      return sendResponse(res, { success: false, error: errorMessage }, 401);
    }

    const { accessToken } = await generateTokens({ options: { id: decoded.id, username: decoded.username } });

    res.cookie("refreshToken", refreshTokenInDb.token, {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "none",
      path: "/",
      expires: refreshTokenInDb.expiresAt,
    });

    return sendResponse(res, { success: true, data: { id: refreshTokenInDb.user.id, username: refreshTokenInDb.user.username, accessToken } });
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      res.clearCookie("refreshToken");
      return sendResponse(res, { success: false, error: "Refresh token has expired. Please re-login." }, 401);
    }

    if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
      return sendResponse(res, { success: false, error: "Token issue. Please re-login." }, 401);
    }

    next(error);
  }
};

export const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.signedCookies.refreshToken || req.cookies.refreshToken;

    const prisma: PrismaClient = req.app.get("prisma");

    if (refreshToken) {
      await prisma.refreshToken.delete({
        where: { token: refreshToken },
      });
    }

    res.clearCookie("refreshToken");

    return sendResponse(res, { success: true, message: "Logged out successfully." });
  } catch (error) {
    next(error);
  }
};
