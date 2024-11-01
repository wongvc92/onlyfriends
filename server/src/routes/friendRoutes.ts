import { Router } from "express";
import { authenticateJWT } from "../config/authMiddleware";
import { addFriends, deleteFriends } from "../controllers/friendControllers";

const friendRoutes = Router();

friendRoutes.post("/api/friends", authenticateJWT, addFriends);
friendRoutes.delete("/api/friends/:peopleId", authenticateJWT, deleteFriends);

export default friendRoutes;
