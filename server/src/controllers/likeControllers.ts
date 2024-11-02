import { Request, Response } from "express";
import pool from "../config/db";
import { JwtPayload } from "jsonwebtoken";

export const likePost = async (req: Request, res: Response) => {
  const currentUser = req.user as JwtPayload;
  if (!currentUser) {
    res.status(401).json({ message: "user  is required" });
    return;
  }
  const { postId } = req.body;

  if (!postId) {
    res.status(401).json({ message: "postId is required" });
    return;
  }
  try {
    await pool.query(
      `
       INSERT INTO likes 
       (post_id, user_id)
       values ($1, $2)
        `,
      [postId, currentUser.id]
    );

    res.status(200).json({ message: "Succesfully like post" });
  } catch (error) {
    console.log("Internal server error", error);
    res.status(500).json({ message: "Failed like post" });
  }
};

export const unlikePost = async (req: Request, res: Response) => {
  const currentUser = req.user as JwtPayload;
  if (!currentUser) {
    res.status(401).json({ message: "user  is required" });
    return;
  }
  const { postId } = req.body;

  if (!postId) {
    res.status(401).json({ message: "postId is required" });
    return;
  }
  try {
    await pool.query(
      `
       DELETE 
       FROM likes
       WHERE
       post_id = $1 AND user_id = $2
        `,
      [postId, currentUser.id]
    );

    res.status(200).json({ message: "Succesfully like post" });
  } catch (error) {
    console.log("Internal server error", error);
    res.status(500).json({ message: "Failed like post" });
  }
};

export const getLikeByPostId = async (req: Request, res: Response) => {
  const currentUser = req.user as JwtPayload;
  if (!currentUser) {
    res.status(401).json({ message: "user  is required" });
    return;
  }
  const postId = req.params.postId;
  if (!postId) {
    res.status(401).json({ message: "postId is required" });
    return;
  }
  try {
    const likeResult = await pool.query(
      `
        SELECT * 
        FROM likes 
        WHERE post_id=$1 AND user_id=$2
        `,
      [postId, currentUser.id]
    );
    let isLiked;
    if (likeResult.rowCount === 0) {
      isLiked = false;
    } else {
      isLiked = true;
    }

    const likeCountResult = await pool.query(
      `
      SELECT count(*) as count
      FROM likes
      WHERE
      post_id = $1
      `,
      [postId]
    );

    const likesCount = likeCountResult.rows[0].count;

    res.status(200).json({ isLiked, likesCount });
  } catch (error) {
    console.log("Internal server error", error);
    res.status(500).json({ message: "Failed fetch like" });
  }
};
