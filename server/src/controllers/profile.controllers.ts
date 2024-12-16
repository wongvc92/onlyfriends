import { Request, Response } from "express";
import { profileSchema } from "../validation/profileSchema";
import AuthError from "../error/AuthError";
import { profileServices } from "../services/profile.services";
import { asyncHandler } from "../middleware/asyncHandler";
import { HTTPSTATUS } from "../config/http.config";
import BadRequestError from "../error/BadRequestError";

const createProfile = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = req.user;
  if (!currentUser) {
    throw new AuthError("Please login.");
  }

  const parsedData = profileSchema.parse(req.body);

  await profileServices.createProfile(parsedData, currentUser.id);
  res.status(HTTPSTATUS.CREATED).json({ message: "Successfully created profile!" });
});

const getProfileByUsername = asyncHandler(async (req: Request, res: Response) => {
  const username = req.params.username;

  if (!username) {
    throw new BadRequestError("Username is required");
  }

  const profile = await profileServices.getProfileByUsername(username);
  res.status(HTTPSTATUS.OK).json({ profile });
});

const editProfileById = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = req.user;
  if (!currentUser) {
    if (!currentUser) {
      throw new AuthError("Please login.");
    }
  }

  const profileId = req.params.profileId;
  if (!profileId) {
    throw new BadRequestError("profileiId is required");
  }

  const parsedData = profileSchema.parse(req.body);
  await profileServices.editProfileById(parsedData, profileId);
  res.status(HTTPSTATUS.OK).json({ message: "Successfully updated profile!" });
});

export const profileControllers = {
  createProfile,
  getProfileByUsername,
  editProfileById,
};
