import { Request, Response } from "express";
import { createCommentSchema, deleteCommentSchema, editCommentSchema, getCommentsByPostIdSchema } from "../validation/commentSchema";
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

  const { comment, post_id } = createCommentSchema.parse(req.body);
  const createdComment = await commentServices.addComment(post_id, comment, currentUser.id);
  res.status(HTTPSTATUS.CREATED).json({ comment: createdComment, message: "Successfully add comment" });
});

export const getCommentsByPostId = asyncHandler(async (req: Request, res: Response) => {
  const parsed = getCommentsByPostIdSchema.parse({
    params: req.params,
    query: req.query,
  });

  const { postId } = parsed.params;
  const { page, limit } = parsed.query;

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

export const deleteCommentById = asyncHandler(async (req: Request, res: Response) => {
  const { commentId } = deleteCommentSchema.parse(req.params);
  await commentServices.deleteCommentById(commentId);
  res.status(HTTPSTATUS.OK).json({ message: "Comment deleted." });
});

export const editCommentById = asyncHandler(async (req: Request, res: Response) => {
  const { body, params } = editCommentSchema.parse(req);

  const { comment } = body;
  const { commentId } = params;

  const updatedComment = await commentServices.editCommentById(comment, commentId);
  res.status(HTTPSTATUS.CREATED).json({ comment: updatedComment, message: "Comment edited." });
});

export const commentsControllers = {
  addComment,
  getCommentsByPostId,
  deleteCommentById,
  editCommentById,
};
