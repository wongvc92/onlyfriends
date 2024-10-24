import { Router } from "express";
import { registerUser, verifyEmailByToken } from "../controllers/registerControllers";

const registerRoutes = Router();

registerRoutes.post("/api/register", registerUser);
registerRoutes.post("/api/register/verify-email", verifyEmailByToken);

export default registerRoutes;
