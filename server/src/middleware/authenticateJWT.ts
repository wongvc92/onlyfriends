import { NextFunction, Request, Response } from "express";
import { jwtDecode } from "jwt-decode";
import BadRequestError from "../error/BadRequestError";

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      throw new BadRequestError("Authentication token not found");
    }

    const decoded = jwtDecode<{ id: string; username: string; email: string }>(
      token
    );

    req.user = decoded;
    next();
  } catch (error) {
    next();
  }
};
