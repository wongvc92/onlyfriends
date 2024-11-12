import { Router } from "express";
import { authenticateJWT } from "../config/authMiddleware";
import {
  addPost,
  deletePost,
  editPost,
  getAllPosts,
  getPost,
} from "../controllers/postControllers";

const postRoutes = Router();

postRoutes.post("/api/posts", authenticateJWT, addPost);
postRoutes.delete("/api/post", authenticateJWT, deletePost);
postRoutes.get("/api/posts/individual/:username", authenticateJWT, getPost);
postRoutes.get("/api/posts/all", authenticateJWT, getAllPosts);
postRoutes.put("/api/posts/:postId", authenticateJWT, editPost);

export default postRoutes;
