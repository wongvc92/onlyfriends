import { Request, Response } from "express";
import AuthError from "../error/AuthError";
import BadRequestError from "../error/BadRequestError";
import { likeServices } from "../services/like.services";
import { HTTPSTATUS } from "../config/http.config";
import { asyncHandler } from "../middleware/asyncHandler";

const createLikeByPostId = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = req.user;
  if (!currentUser) {
    throw new AuthError("Please login");
  }
  const { postId } = req.params;

  if (!postId || typeof postId !== "string") {
    throw new BadRequestError("postId is required");
  }

  await likeServices.createLikeByPostId(postId, currentUser.id);

  res.status(HTTPSTATUS.CREATED).json({ message: "Succesfully like post" });
});

const deleteLikeByPostId = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = req.user;
  if (!currentUser) {
    throw new AuthError("Please login");
  }
  const { postId } = req.params;

  if (!postId) {
    throw new BadRequestError("postId is required");
  }

  await likeServices.deleteLikeByPostId(postId, currentUser.id);

  res.status(HTTPSTATUS.OK).json({ message: "Succesfully like post" });
});

const getLikeByPostId = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = req.user;
  if (!currentUser) {
    throw new AuthError("Please login");
  }
  const postId = req.params.postId;
  if (!postId) {
    throw new BadRequestError("postId is required");
  }

  const { isLiked, likesCount } = await likeServices.getLikeByPostId(postId, currentUser.id);

  res.status(HTTPSTATUS.OK).json({ isLiked, likesCount });
});

export const likeControllers = { createLikeByPostId, deleteLikeByPostId, getLikeByPostId };
