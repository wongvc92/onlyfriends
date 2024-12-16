import { Router } from "express";
import { authenticateJWT } from "../middleware/authenticateJWT";
import { commentsControllers } from "../controllers/comment.controllers";

const commentRoutes = Router();

commentRoutes.post("/", authenticateJWT, commentsControllers.addComment);
commentRoutes.put("/:commentId", authenticateJWT, commentsControllers.editCommentById);
commentRoutes.delete("/:commentId", authenticateJWT, commentsControllers.deleteCommentById);
commentRoutes.get("/:postId", authenticateJWT, commentsControllers.getCommentsByPostId);
commentRoutes.get("/count/:postId", authenticateJWT, commentsControllers.getCommentsCountByPostId);

export default commentRoutes;
