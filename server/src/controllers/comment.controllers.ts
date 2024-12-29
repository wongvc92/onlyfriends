import { Request, Response } from "express";
import { commentSchema } from "../validation/commentSchema";
import { asyncHandler } from "../middleware/asyncHandler";
import AuthError from "../error/AuthError";
import { commentServices } from "../services/comment.services";
import { HTTPSTATUS } from "../config/http.config";
import BadRequestError from "../error/BadRequestError";

export const addComment = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = req.user;
  if (!currentUser) {
    throw new AuthError("Please login");
  }

  const { comment, post_id } = commentSchema.parse(req.body);
  const createdComment = await commentServices.addComment(post_id, comment, currentUser.id);
  res.status(HTTPSTATUS.CREATED).json({ comment: createdComment, message: "Successfully add comment" });
});

export const getCommentsByPostId = asyncHandler(async (req: Request, res: Response) => {
  const postId = req.params.postId;
  if (!postId) {
    throw new BadRequestError("post id is required");
  }

  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = (page - 1) * limit;

  const totalComments = await commentServices.getCommentsCountByPostId(postId);
  const totalPages = Math.ceil(totalComments / limit);
  const comments = await commentServices.getCommentsByPostId(postId, limit, offset);

  res.status(HTTPSTATUS.OK).json({
    data: comments,
    currentPage: page,
    nextPage: page < totalPages ? page + 1 : null,
    totalPages,
    totalComments,
  });
});

export const getCommentsCountByPostId = asyncHandler(async (req: Request, res: Response) => {
  const postId = req.params.postId;
  if (!postId) {
    throw new BadRequestError("postId is required");
  }

  const totalComments = await commentServices.getCommentsCountByPostId(postId);
  res.status(HTTPSTATUS.OK).json({ count: totalComments });
});

export const deleteCommentById = asyncHandler(async (req: Request, res: Response) => {
  const commentId = req.params.commentId;
  if (!commentId) {
    throw new BadRequestError("commentId is required.");
  }
  await commentServices.deleteCommentById(commentId);
  res.status(HTTPSTATUS.OK).json({ message: "Comment deleted." });
});

export const editCommentById = asyncHandler(async (req: Request, res: Response) => {
  const commentId = req.params.commentId;
  if (!commentId) {
    throw new BadRequestError("commentId is required.");
  }

  const { comment } = commentSchema.parse(req.body);
  const updatedComment = await commentServices.editCommentById(comment, commentId);
  res.status(HTTPSTATUS.CREATED).json({ comment: updatedComment, message: "Comment edited." });
});

export const commentsControllers = {
  addComment,
  getCommentsByPostId,
  getCommentsCountByPostId,
  deleteCommentById,
  editCommentById,
};
