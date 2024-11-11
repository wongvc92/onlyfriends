import { Router } from "express";
import { authenticateJWT } from "../config/authMiddleware";
import {
  addComment,
  deleteComment,
  getCommentCountByPostId,
  getCommentsByPostId,
} from "../controllers/commentControllers";

const commentRoutes = Router();

commentRoutes.post("/api/comments", authenticateJWT, addComment);
commentRoutes.get(
  "/api/comments/:postId",
  authenticateJWT,
  getCommentsByPostId
);
commentRoutes.delete(
  "/api/comments/:commentId",
  authenticateJWT,
  deleteComment
);
commentRoutes.get(
  "/api/comments/count/:postId",
  authenticateJWT,
  getCommentCountByPostId
);
export default commentRoutes;
