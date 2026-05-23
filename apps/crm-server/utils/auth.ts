import { CookieOptions, Request } from "express";

const isProduction = process.env.NODE_ENV === "production";

const parseBearerToken = (authorizationHeader?: string) => {
  if (!authorizationHeader) return undefined;

  const [scheme, token] = authorizationHeader.split(" ");
  if (scheme !== "Bearer" || !token) return undefined;

  return token;
};

export const getAccessTokenFromRequest = (req: Request) =>
  req.cookies?.accessToken || parseBearerToken(req.header("authorization"));

export const getRefreshTokenFromRequest = (req: Request) =>
  req.cookies?.refreshToken || parseBearerToken(req.header("authorization"));

export const authCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/",
};
