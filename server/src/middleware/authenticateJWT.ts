import { NextFunction, Request, Response } from "express";
import AuthError from "../error/AuthError";
import { jwtUtils } from "../utils/jwt";
import { config } from "../config/app.config";

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      throw new AuthError("access token not found");
    }

    const decoded = jwtUtils.decodeToken({ requestToken: accessToken, tokenSecret: config.JWT.ACCESS_TOKEN_SECRET });

    req.user = decoded as { id: string; username: string; email: string };
    next();
  } catch (error) {
    next(error);
  }
};
