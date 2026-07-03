import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});

const _config = {
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY,
  PORT: process.env.PORT,
  CORS_URL: process.env.CORS_URL,
  DATABASE_URL: process.env.DATABASE_URL,
  NVIDIA_API_KEY: process.env.NVIDIA_API_KEY,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_SECURE: process.env.SMTP_SECURE,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  SMTP_FROM: process.env.SMTP_FROM,
};

export const config = Object.freeze(_config);
