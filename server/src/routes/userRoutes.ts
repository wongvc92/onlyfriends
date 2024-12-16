import { Router } from "express";
import { userControllers } from "../controllers/user.controllers";
import { authenticateJWT } from "../middleware/authenticateJWT";

const userRoutes = Router();
userRoutes.get("/", authenticateJWT, userControllers.getUser);

export default userRoutes;
