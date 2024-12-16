import { Response } from "express";

const secure = process.env.NODE_ENV! === "production";
const sameSite = process.env.NODE_ENV! === "production" ? "strict" : "lax";

interface SetCookieProps {
  res: Response;
  tokenName: string;
  signedToken: string;
  maxAge: number;
}
const setCookie = ({ res, tokenName, signedToken, maxAge }: SetCookieProps): Response => {
  return res.cookie(tokenName, signedToken, {
    httpOnly: true,
    secure, // set to false for local testing
    sameSite,
    maxAge, // 15 minutes
    path: "/",
  });
};

interface DeleteCookieProps {
  res: Response;
  tokenName: string;
}

const deleteCookie = ({ res, tokenName }: DeleteCookieProps): Response => {
  return res.clearCookie(tokenName, {
    httpOnly: true,
    secure, // Set to true if using HTTPS
    sameSite,
    path: "/", // Ensure the path matches
  });
};
export const cookieUtils = { setCookie, deleteCookie };
