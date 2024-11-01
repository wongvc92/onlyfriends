import { Router } from "express";
import { authenticateJWT } from "../config/authMiddleware";
import { getPeoples } from "../controllers/peopleControllers";

const peopleRouters = Router();

peopleRouters.get("/api/peoples", authenticateJWT, getPeoples);

export default peopleRouters;
