import { Router } from "express";
import { authenticateJWT } from "../config/authMiddleware";
import { addPost, deletePost, getAllPosts, getPost } from "../controllers/postControllers";

const postRoutes = Router();

postRoutes.post("/api/post", authenticateJWT, addPost);
postRoutes.delete("/api/post", authenticateJWT, deletePost);
postRoutes.get("/api/posts", authenticateJWT, getPost);
postRoutes.get("/api/posts/all", authenticateJWT, getAllPosts);

export default postRoutes;
