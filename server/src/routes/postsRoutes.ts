import { Router } from "express";
import { authenticateJWT } from "../config/authMiddleware";
import { addPost, deletePost, getPost } from "../controllers/postControllers";

const postRoutes = Router();

postRoutes.post("/api/post", authenticateJWT, addPost);
postRoutes.delete("/api/post", authenticateJWT, deletePost);
postRoutes.get("/api/posts", authenticateJWT, getPost);

export default postRoutes;
