import { Router } from "express";
import { authenticateJWT } from "../middleware/authenticateJWT";
import { authControllers } from "../controllers/auth.controllers";

const authRoutes = Router();
authRoutes.get("/renew-access-token", authControllers.renewAccessToken);
authRoutes.post("/reset-password", authControllers.resetPassword);
authRoutes.post("/new-password", authControllers.newPassword);
authRoutes.post("/login", authControllers.loginUser);
authRoutes.post("/logout", authenticateJWT, authControllers.logoutUser);
authRoutes.post("/register", authControllers.registerUser);
authRoutes.post("/verify-email", authControllers.verifyEmailByToken);
export default authRoutes;
