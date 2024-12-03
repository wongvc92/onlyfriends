import { Router } from "express";
import {
  getLikeByPostId,
  likePost,
  unlikePost,
} from "../controllers/likeControllers";
import { authenticateJWT } from "../middleware/authenticateJWT";

export const likeRoutes = Router();

likeRoutes.get("/api/likes/:postId", authenticateJWT, getLikeByPostId);
likeRoutes.post("/api/likes", authenticateJWT, likePost);
likeRoutes.delete("/api/likes", authenticateJWT, unlikePost);

export default likeRoutes;
