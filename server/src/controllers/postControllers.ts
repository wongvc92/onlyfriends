import { Request, Response } from "express";
import pool from "../config/db";
import { JwtPayload } from "jsonwebtoken";
import { postSchema } from "../validation/postsSchema";

export const addPost = async (req: Request, res: Response) => {
  try {
    const user = req.user as JwtPayload;
    const userId = user.id;

    if (!userId) {
      res.status(401).json({ message: "userId is required" });
      return;
    }

    const data = req.body;
    const parsedResult = postSchema.safeParse(data);
    if (!parsedResult.success) {
      const err = parsedResult.error.issues
        .map((issue) => issue.message)
        .join("- ");
      console.log("Failed parsed comment data", err);
      res.status(401).json({ message: "Please check form input" });
      return;
    }

    const { post } = parsedResult.data;
    await pool.query("INSERT INTO posts (post, user_id) values ($1,$2)", [
      post,
      userId,
    ]);
    res.status(200).json({ message: post });
  } catch (error) {
    console.log("Internal server error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const editPost = async (req: Request, res: Response) => {
  try {
    const postId = req.params.postId;
    if (!postId) {
      res.status(401).json({ message: "postId is required" });
      return;
    }
    const data = req.body;

    const parsedResult = postSchema.safeParse(data);
    if (!parsedResult.success) {
      const err = parsedResult.error.issues
        .map((issue) => issue.message)
        .join("- ");
      console.log("Failed parsed comment data", err);
      res.status(401).json({ message: "Please check form input" });
      return;
    }
    const { post } = parsedResult.data;

    await pool.query(
      `
      
      UPDATE posts 
      SET post = $1
      WHERE id = $2
      `,
      [post, postId]
    );
    res.status(200).json({ message: "Post updated" });
  } catch (error) {
    console.log("Failed update post", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getPost = async (req: Request, res: Response) => {
  try {
    const username = req.params.username;
    if (!username) {
      res.status(401).json({ message: "username is required" });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10; // Increase limit if fetching all posts
    const offset = (page - 1) * limit;

    // Query the total count of all posts for pagination
    const totalPostsResult = await pool.query(
      `SELECT COUNT(*) 
      FROM posts
      JOIN users ON posts.user_id = users.id
      WHERE users.username = $1
      `,
      [username]
    );
    const totalPosts = parseInt(totalPostsResult.rows[0].count);
    const totalPages = Math.ceil(totalPosts / limit);

    const postsResult = await pool.query(
      `
      SELECT 
        posts.*,
        users.username,
        profiles.name,
        profiles.bio,
        profiles.location,
        profiles.website
      FROM posts
      JOIN users ON posts.user_id = users.id
      LEFT JOIN profiles ON profiles.user_id = users.id
      WHERE users.username = $1
      ORDER BY posts.created_at DESC
      LIMIT $2 OFFSET $3
    `,
      [username, limit, offset]
    );

    const posts = postsResult.rows;

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

    await pool.query("DELETE from posts WHERE id=$1 AND user_id=$2", [
      postId,
      userId,
    ]);

    res.status(200).json({ message: "Post deleted!" });
  } catch (error) {
    console.log("Internal server error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10; // Increase limit if fetching all posts
    const offset = (page - 1) * limit;

    // Query the total count of all posts for pagination
    const totalPostsResult = await pool.query("SELECT COUNT(*) FROM posts");
    const totalPosts = parseInt(totalPostsResult.rows[0].count);
    const totalPages = Math.ceil(totalPosts / limit);

    const postsResult = await pool.query(
      `
      SELECT 
        posts.*,
        users.username,
        profiles.name,
        profiles.bio,
        profiles.location,
        profiles.website
      FROM posts
      JOIN users ON posts.user_id = users.id
      LEFT JOIN profiles ON profiles.user_id = users.id
      ORDER BY posts.created_at DESC
      LIMIT $1 OFFSET $2
    `,
      [limit, offset]
    );

    const posts = postsResult.rows;

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
