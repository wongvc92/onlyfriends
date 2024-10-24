import { Router } from "express";
import { loginUser, refreshToken } from "../controllers/loginControllers";

const loginRoutes = Router();

loginRoutes.post("/api/login", loginUser);

loginRoutes.post("/api/refresh-token", refreshToken);

export default loginRoutes;
