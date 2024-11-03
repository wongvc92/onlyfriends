import { Router } from "express";
import { authenticateJWT } from "../config/authMiddleware";
import { addComment, getCommentCountByPostId, getCommentsByPostId } from "../controllers/commentControllers";

const commentRoutes = Router();

commentRoutes.post("/api/comments", authenticateJWT, addComment);
commentRoutes.get("/api/comments/:postId", authenticateJWT, getCommentsByPostId);
commentRoutes.get("/api/comments/count/:postId", authenticateJWT, getCommentCountByPostId);
export default commentRoutes;
