import { Router } from "express";
import { authenticateJWT } from "../middleware/authenticateJWT";
import {
  addPost,
  deletePost,
  editPost,
  getAllPosts,
  getPost,
  getPostById,
} from "../controllers/postControllers";

const postRoutes = Router();

postRoutes.post("/api/posts", authenticateJWT, addPost);
postRoutes.delete("/api/post", authenticateJWT, deletePost);
postRoutes.get("/api/posts/individual/:username", authenticateJWT, getPost);
postRoutes.get("/api/posts/all", authenticateJWT, getAllPosts);
postRoutes.put("/api/posts/:postId", authenticateJWT, editPost);
postRoutes.get("/api/posts/:postId", authenticateJWT, getPostById);

export default postRoutes;
