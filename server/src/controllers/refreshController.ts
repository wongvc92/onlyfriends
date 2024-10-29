import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export const refreshAccessToken = (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    res.status(400).json({ message: "Refresh token not found" });
  }

  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as JwtPayload;

  const newAccessToken = jwt.sign(
    {
      id: decoded.id,
      email: decoded.email,
      username: decoded.username,
      image: decoded.image,
    },
    process.env.JWT_SECRET_KEY!,
    { expiresIn: "15m" }
  );

  res.cookie("accessToken", newAccessToken, {
    httpOnly: true,
    secure: false, // set to false for local testing
    sameSite: "lax",
    maxAge: 3600000, // 15 minutes
    path: "/",
  });
};
