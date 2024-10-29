import { Request, Response } from "express";
import pool from "../config/db";
import { JwtPayload } from "jsonwebtoken";

export const addPost = async (req: Request, res: Response) => {
  const { post } = req.body;
  console.log(post);
  const user = req.user as JwtPayload;
  const userId = user.id;

  console.log("userId", userId);
  if (!userId) {
    res.status(400).json({ message: "userId is required" });
    return;
  }

  if (!post) {
    res.status(400).json({ message: "Post content is required" });
    return;
  }
  await pool.query("INSERT INTO posts (post, user_id) values ($1,$2)", [post, userId]);
  res.status(200).json({ message: post });
};

export const getPost = async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  const userId = user?.id;
  if (!userId) {
    res.status(400).json({ message: "Post content and userId are required" });
    return;
  }
  const postsResult = await pool.query("SELECT * FROM posts WHERE user_id = $1", [userId]);

  const posts = postsResult.rows.map(({ user_id, ...rest }) => rest);
  res.status(200).json({ posts });
};
