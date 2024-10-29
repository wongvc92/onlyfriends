import { Router } from "express";
import { loginUser } from "../controllers/loginControllers";

const loginRoutes = Router();

loginRoutes.post("/api/login", loginUser);

export default loginRoutes;
