import { Request, Response } from "express";

export const logoutUser = async (req: Request, res: Response) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false, // Set to true if using HTTPS
    sameSite: "lax",
    path: "/", // Ensure the path matches
  });

  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: false, // Set to true if using HTTPS
    sameSite: "lax",
    path: "/", // Ensure the path matches
  });

  res.status(200).json({ message: "Logged out successfully" });
};
