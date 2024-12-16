import { Router } from "express";
import { postControllers } from "../controllers/post.controllers";

const postRoutes = Router();

postRoutes.get("/", postControllers.getAllPosts);
postRoutes.post("/", postControllers.createPost);
postRoutes.delete("/:postId", postControllers.deletePost);
postRoutes.put("/:postId", postControllers.editPostById);

postRoutes.get("/user/:username", postControllers.getPostsByUsername);
postRoutes.get("/:postId", postControllers.getSinglePostById);

export default postRoutes;
