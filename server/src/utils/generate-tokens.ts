import { sign } from "jsonwebtoken";

export const generateTokens = (userId: string, username: string) => {
  const accessToken = sign({ id: userId, username }, process.env.JWT_SECRET_KEY!, { expiresIn: "2m" });
  const refreshToken = sign({ id: userId, username }, process.env.JWT_REFRESH_SECRET_KEY!, { expiresIn: "7d" });
  return { accessToken, refreshToken };
};

export const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
