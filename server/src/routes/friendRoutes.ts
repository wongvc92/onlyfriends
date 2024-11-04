import { Router } from "express";
import { authenticateJWT } from "../config/authMiddleware";
import { addFriends, deleteFriends, editFriendStatus, getFriendsRequest, getFriendStatusByPeopleId } from "../controllers/friendControllers";

const friendRoutes = Router();

friendRoutes.post("/api/friends", authenticateJWT, addFriends);
friendRoutes.delete("/api/friends/:peopleId", authenticateJWT, deleteFriends);

friendRoutes.put("/api/friends/:friendRequestId", authenticateJWT, editFriendStatus);
friendRoutes.get("/api/friends/requests", authenticateJWT, getFriendsRequest);
friendRoutes.get("/api/friends/status/:peopleId", authenticateJWT, getFriendStatusByPeopleId);

export default friendRoutes;
