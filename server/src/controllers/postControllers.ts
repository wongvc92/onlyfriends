import { Request, Response } from "express";
import pool from "../config/db";
import { JwtPayload } from "jsonwebtoken";

export const addPost = async (req: Request, res: Response) => {
  try {
    const { post } = req.body;
    console.log(post);
    const user = req.user as JwtPayload;
    const userId = user.id;

    console.log("userId", userId);
    if (!userId) {
      res.status(401).json({ message: "userId is required" });
      return;
    }

    if (!post) {
      res.status(400).json({ message: "Post content is required" });
      return;
    }
    await pool.query("INSERT INTO posts (post, user_id) values ($1,$2)", [post, userId]);
    res.status(200).json({ message: post });
  } catch (error) {
    console.log("Internal server error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getPost = async (req: Request, res: Response) => {
  try {
    const user = req.user as JwtPayload;
    const userId = user?.id;
    if (!userId) {
      res.status(401).json({ message: "userId are required" });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 3;
    const offset = (page - 1) * limit;

    // Query the total count of posts for the user to calculate total pages
    const totalPostsResult = await pool.query("SELECT COUNT(*) FROM posts WHERE user_id = $1", [userId]);
    const totalPosts = parseInt(totalPostsResult.rows[0].count);
    const totalPages = Math.ceil(totalPosts / limit);

    const postsResult = await pool.query("SELECT * FROM posts WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3", [
      userId,
      limit,
      offset,
    ]);

    const posts = postsResult.rows.map(({ user_id, ...rest }) => rest);

    res.status(200).json({
      data: posts,
      currentPage: page,
      nextPage: page < totalPages ? page + 1 : null,
      totalPages,
      totalPosts,
    });
  } catch (error) {
    console.log("Internal server error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const user = req.user as JwtPayload;
    const userId = user?.id;
    if (!userId) {
      res.status(401).json({ message: "userId is required" });
      return;
    }

    const postId = req.query.id as string;

    if (!postId) {
      res.status(401).json({ message: "postId is required" });
      return;
    }

    await pool.query("DELETE from posts WHERE id=$1 AND user_id=$2", [postId, userId]);

    res.status(200).json({ message: "Post deleted!" });
  } catch (error) {
    console.log("Internal server error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
