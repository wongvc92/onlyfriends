import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      res.status(401).json({ message: "Authentication token not found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!);

    req.user = decoded;

    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      console.error("Token expired:", error);
      res.status(401).json({ message: "Token has expired" });
      return;
    } else {
      console.error("JWT verification error:", error);
      res.status(401).json({ message: "Invalid token" });
      return;
    }
  }
};
