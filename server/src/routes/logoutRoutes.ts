import { Router } from "express";
import { logoutUser } from "../controllers/logoutContollers";

const logoutRoutes = Router();
logoutRoutes.post("/api/logout", logoutUser);

export default logoutRoutes;
