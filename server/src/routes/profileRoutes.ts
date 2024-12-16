import { Router } from "express";
import { profileControllers } from "../controllers/profile.controllers";

const profileRoutes = Router();

profileRoutes.post("/", profileControllers.createProfile);
profileRoutes.get("/:username", profileControllers.getProfileByUsername);
profileRoutes.put("/:profileId", profileControllers.editProfileById);

export default profileRoutes;
