import { Request, Response } from "express";
import { commentSchema } from "../validation/commentSchema";
import pool from "../config/db";
import { JwtPayload } from "jsonwebtoken";

export const addComment = async (req: Request, res: Response) => {
  const currentUser = req.user as JwtPayload;
  if (!currentUser) {
    res.status(401).json({ message: "userId required" });
    return;
  }

  const data = req.body;

  const parsedResult = commentSchema.safeParse(data);
  if (!parsedResult.success) {
    const err = parsedResult.error.issues
      .map((issue) => issue.message)
      .join("- ");
    console.log("Failed parsed comment data", err);
    res.status(401).json({ message: "Please check form input" });
    return;
  }
  const { comment, post_id } = parsedResult.data;
  try {
    await pool.query(
      `
        INSERT INTO 
        comments (post_id, comment, user_id)
        values ($1, $2, $3)
        `,
      [post_id, comment, currentUser.id]
    );
    res.status(200).json({ message: "Successfully add comment" });
  } catch (error) {
    console.log("Failed add comment", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCommentsByPostId = async (req: Request, res: Response) => {
  const postId = req.params.postId;
  if (!postId) {
    res.status(401).json({ message: "postId is required" });
    return;
  }

  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = (page - 1) * limit;

  try {
    const totalCommentResult = await pool.query(
      `
    SELECT count(*)
    FROM comments
    WHERE post_id = $1
    `,
      [postId]
    );

    const totalComments = parseInt(totalCommentResult.rows[0].count);
    const totalPages = Math.ceil(totalComments / limit);

    const commentsResults = await pool.query(
      `
      SELECT 
      comments.* ,
      users.username,
      profiles.name
      FROM comments
      JOIN users on comments.user_id = users.id
      LEFT JOIN profiles ON profiles.user_id = users.id
      Where post_id = $1
      ORDER BY comments.created_at DESC
      LIMIT $2 OFFSET $3
      `,
      [postId, limit, offset]
    );

    const comments = commentsResults.rows;

    res.status(200).json({
      data: comments,
      currentPage: page,
      nextPage: page < totalPages ? page + 1 : null,
      totalPages,
      totalComments,
    });
  } catch (error) {
    console.log("Failed get comments by postId", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCommentCountByPostId = async (req: Request, res: Response) => {
  const postId = req.params.postId;
  if (!postId) {
    res.status(401).json({ message: "postId is required" });
    return;
  }
  try {
    const totalCommentResult = await pool.query(
      `
    SELECT count(*)
    FROM comments
    WHERE post_id = $1
    `,
      [postId]
    );

    const totalComments = parseInt(totalCommentResult.rows[0].count);

    res.status(200).json({ count: totalComments });
  } catch (error) {
    console.log("Failed get comments by postId", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  const commentId = req.params.commentId;
  if (!commentId) {
    res.status(401).json({ message: "commentId is required." });
    return;
  }

  try {
    await pool.query(
      `
        DELETE 
        FROM comments 
        WHERE id=$1
      `,
      [commentId]
    );
    res.status(200).json({ message: "Comment deleted." });
  } catch (error) {
    console.log("Failed delete comment", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const editComment = async (req: Request, res: Response) => {
  const commentId = req.params.commentId;
  if (!commentId) {
    res.status(401).json({ message: "commentId is required." });
    return;
  }
  const data = req.body;

  const parsedResult = commentSchema.safeParse(data);

  if (!parsedResult.success) {
    const err = parsedResult.error.issues
      .map((issue) => `${issue.path}-${issue.message}`)
      .join("- ");
    console.log("Failed parsed comment data", err);
    res.status(401).json({ message: "Please check form input" });
    return;
  }
  const { comment } = data;
  try {
    await pool.query(
      `
        UPDATE comments 
        set comment = $1
        WHERE id=$2
      `,
      [comment, commentId]
    );
    res.status(200).json({ message: "Comment edited." });
  } catch (error) {
    console.log("Failed edit comment", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
