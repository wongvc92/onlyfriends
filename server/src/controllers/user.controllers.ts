import { Request, Response } from "express";
import { IUserClient } from "../types/Users";

import { asyncHandler } from "../middleware/asyncHandler";
import { HTTPSTATUS } from "../config/http.config";
import AuthError from "../error/AuthError";

const getUser = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = req.user;
  if (!currentUser) {
    throw new AuthError("please login.");
  }
  const clientUserInfo: IUserClient = {
    username: currentUser.username,
    email: currentUser.email,
    id: currentUser.id,
    display_image: currentUser.display_image,
    name: currentUser.name,
  };
  res.status(HTTPSTATUS.OK).json({
    user: clientUserInfo,
  });
});

export const userControllers = {
  getUser,
};
