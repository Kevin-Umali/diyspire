import { sign } from "jsonwebtoken";

interface GenerateTokenOptions {
  options: UserPayload | EmailPayload;
}

interface UserPayload {
  id: string;
  username: string;
}

interface EmailPayload {
  id: string | number;
  email: string;
}

export const generateTokens = async ({ options }: GenerateTokenOptions) => {
  let keys: { accessTokenKey: string; refreshTokenKey?: string; expiresIn?: string };

  if ("email" in options) {
    keys = {
      accessTokenKey: process.env.EMAIL_SECRET_KEY!,
      expiresIn: "30d",
    };
  } else {
    keys = {
      accessTokenKey: process.env.JWT_SECRET_KEY!,
      refreshTokenKey: process.env.JWT_REFRESH_SECRET_KEY!,
      expiresIn: "1h",
    };
  }

  const payload = "email" in options ? { id: options.id, email: options.email } : { id: options.id, username: options.username };
  const accessToken = sign(payload, keys.accessTokenKey, { expiresIn: keys.expiresIn ?? "1h" });

  let refreshToken;
  if (keys.refreshTokenKey) {
    refreshToken = sign(payload, keys.refreshTokenKey, { expiresIn: "2d" });
  }

  return refreshToken ? { accessToken, refreshToken } : { accessToken };
};

export const refreshTokenExpiry = () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
