import { Router } from "express";
import { addProfile, editProfile, getProfile } from "../controllers/profileControllers";
import { authenticateJWT } from "../config/authMiddleware";

const profileRoutes = Router();

profileRoutes.post("/api/profiles", authenticateJWT, addProfile);
profileRoutes.get("/api/profiles/:username", authenticateJWT, getProfile);
profileRoutes.put("/api/profiles/:profileId", authenticateJWT, editProfile);

export default profileRoutes;
