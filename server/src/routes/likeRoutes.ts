import { Router } from "express";
import { likeControllers } from "../controllers/like.controllers";

export const likeRoutes = Router();

likeRoutes.post("/:postId", likeControllers.createLikeByPostId);
likeRoutes.delete("/:postId", likeControllers.deleteLikeByPostId);

export default likeRoutes;
