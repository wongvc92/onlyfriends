import { Request, Response } from "express";

export const logoutUser = async (req: Request, res: Response) => {
  res.clearCookie("refreshToken");

  res.status(200).json({ message: "Logged out successfully" });
};
