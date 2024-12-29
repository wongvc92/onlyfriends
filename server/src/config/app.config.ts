import { getEnv } from "../utils/getEnv";

const appConfig = () => ({
  NODE_ENV: getEnv("NODE_ENV"),
  APP_ORIGIN: getEnv("APP_ORIGIN"),
  PORT: parseInt(getEnv("PORT")),
  DATABASE_URL: getEnv("DATABASE_URL"),
  JWT: {
    ACCESS_TOKEN_NAME: "accessToken",
    ACCESS_TOKEN_SECRET: getEnv("ACCESS_TOKEN_SECRET"),
    ACCESS_TOKEN_EXPIRES_IN: "5m",
    REFRESH_TOKEN_NAME: "refreshToken",
    REFRESH_TOKEN_SECRET: getEnv("REFRESH_TOKEN_SECRET"),
    REFRESH__TOKEN_EXPIRES_IN: "7d",
  },
  RESEND: {
    RESEND_API_KEY: getEnv("RESEND_API_KEY"),
    RESEND_VERIFIED_DOMAIN: getEnv("RESEND_VERIFIED_DOMAIN"),
  },
  cookie: {
    COOKIE_ACCESS_TOKEN_MAX_AGE: 5 * 60 * 1000,
    COOKIE_REFRESN_TOKEN_MAX_AGE: 7 * 24 * 60 * 60 * 1000,
  },
});

export const config = appConfig();
