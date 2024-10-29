import { Router } from "express";
import { authenticateJWT } from "../config/authMiddleware";
import { addPost, getPost } from "../controllers/postControllers";

const postRoutes = Router();

postRoutes.post("/api/post", authenticateJWT, addPost);
postRoutes.get("/api/posts", authenticateJWT, getPost);

export default postRoutes;
