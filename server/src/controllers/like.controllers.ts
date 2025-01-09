import { Request, Response } from "express";
import AuthError from "../error/AuthError";
import { likeServices } from "../services/like.services";
import { HTTPSTATUS } from "../config/http.config";
import { asyncHandler } from "../middleware/asyncHandler";
import { likeSchema } from "../validation/likeSchema";
import BadRequestError from "../error/BadRequestError";

const createLikeByPostId = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = req.user;
  if (!currentUser) {
    throw new AuthError("Please login");
  }
  const { params } = likeSchema.parse(req);
  const { postId } = params;

  const likeCount = await likeServices.getLikeByPostId(postId, currentUser.id);
  if (likeCount === 1) {
    throw new BadRequestError("You already liked the post");
  }
  await likeServices.createLikeByPostId(postId, currentUser.id);

  res.status(HTTPSTATUS.CREATED).json({ message: "Succesfully like post" });
});

const deleteLikeByPostId = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = req.user;
  if (!currentUser) {
    throw new AuthError("Please login");
  }
  const { params } = likeSchema.parse(req);
  const { postId } = params;

  const likeCount = await likeServices.getLikeByPostId(postId, currentUser.id);
  if (likeCount === 0) {
    throw new BadRequestError("You already disliked the post");
  }

  await likeServices.deleteLikeByPostId(postId, currentUser.id);

  res.status(HTTPSTATUS.OK).json({ message: "Succesfully like post" });
});

export const likeControllers = { createLikeByPostId, deleteLikeByPostId };
