import { Router } from "express";
import { getUser } from "../controllers/userControllers";
import { authenticateJWT } from "../middleware/authenticateJWT";
import { refreshAccessToken } from "../controllers/loginControllers";

const authRoutes = Router();
authRoutes.get("/api/user", authenticateJWT, getUser);
authRoutes.post("/api/refresh-token", refreshAccessToken);
export default authRoutes;
