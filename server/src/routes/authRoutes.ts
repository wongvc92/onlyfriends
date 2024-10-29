import { Router } from "express";
import { checkAuth } from "../controllers/checkAuthControllers";
import { authenticateJWT } from "../config/authMiddleware";
import { refreshAccessToken } from "../controllers/loginControllers";

const authRoutes = Router();
authRoutes.get("/api/check-auth", authenticateJWT, checkAuth);
authRoutes.post("/api/refresh-token", authenticateJWT, refreshAccessToken);
export default authRoutes;
