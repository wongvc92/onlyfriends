import { Request, Response } from "express";
import { IUser, IUserClient } from "../types/Users";

export const getUser = async (req: Request, res: Response) => {
  if (req.user) {
    const user = req.user as IUser;

    console.log("req.user", req.user);

    const clientUserInfo: IUserClient = {
      username: user.username,
      email: user.email,
      id: user.id,
    };
    res.status(200).json({
      user: clientUserInfo,
    });
  } else {
    console.log("No user found in request.");
    res.status(401).json({ message: "No user found in request." });
  }
};
