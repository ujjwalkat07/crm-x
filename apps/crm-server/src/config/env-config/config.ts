import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});

const _config = {
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY,
  PORT : process.env.PORT,
  CORS_URL:process.env.CORS_URL
};

export const config = Object.freeze(_config);
