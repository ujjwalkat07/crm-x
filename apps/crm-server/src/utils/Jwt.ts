import jwt, { Secret, SignOptions, JwtPayload } from "jsonwebtoken";
import { config } from "../../src/config/env-config/config";

interface payload extends JwtPayload {
  id: string;
  email?: string;
  fullname?: string;
}
interface expiresIN extends SignOptions {
  expiry: string;
}

export const accessTokenJwtSign = (UserPayLoad: payload) =>
  jwt.sign(
    {
      UserPayLoad,
    },
    config.ACCESS_TOKEN_SECRET as Secret, //why we use as Secret? because we are using the secret key as a string and we need to convert it to a Secret type because jwt.sign function expects a Secret type but we are passing a config object which is a string
    {
      expiresIn: config.ACCESS_TOKEN_EXPIRY,
    } as expiresIN //why we use as SignOptions? because we are using the expiry time as a string and we need to convert it to a SignOptions type because jwt.sign function expects a SignOptions type but we are passing a config object which is a type of string and we need to convert it to a SignOptions type
  );

export const refreshTokenJwtSign = (UserPayLoad: payload) =>
  jwt.sign(
    {
      UserPayLoad,
    },
    config.REFRESH_TOKEN_SECRET as Secret, //why we use as Secret? because we are using the secret key as a string and we need to convert it to a Secret type because jwt.sign function expects a Secret type but we are passing a config object which is a string
    {
      expiresIn: config.REFRESH_TOKEN_EXPIRY,
    } as expiresIN //why we use as SignOptions? because we are using the expiry time as a string and we need to convert it to a SignOptions type because jwt.sign function expects a SignOptions type but we are passing a config object which is a type of string and we need to convert it to a SignOptions type
  );

export const jwtVerifyAccessToken = (Token: string): payload =>
  jwt.verify(Token, config.ACCESS_TOKEN_SECRET as Secret) as payload;

export const jwtVerifyRefreshToken = (Token: string): payload =>
  jwt.verify(Token, config.REFRESH_TOKEN_SECRET as Secret) as payload;
