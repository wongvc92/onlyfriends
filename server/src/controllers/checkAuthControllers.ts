import { Request, Response } from "express";
import { IUser, IUserClient } from "../types/Users";

export const checkAuth = async (req: Request, res: Response) => {
  if (req.user) {
    const user = req.user as IUser;

    const clientUserInfo: IUserClient = {
      username: user.username,
      email: user.email,
      id: user.id,
    };
    res.status(200).json({
      isAuthenticated: true,
      user: clientUserInfo,
    });
  } else {
    console.log("No user found in request.");
    res.status(401).json({ message: "gagagag" });
  }
};
