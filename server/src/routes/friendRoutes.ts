import { Router } from "express";
import { authenticateJWT } from "../config/authMiddleware";
import {
  addFriends,
  deleteFriends,
  editFriendStatus,
  getAcceptedFriends,
  getFriendsRequest,
  getFriendStatusByPeopleId,
  getSentFriendRequests,
} from "../controllers/friendControllers";

const friendRoutes = Router();

friendRoutes.post("/api/friends", authenticateJWT, addFriends);
friendRoutes.delete("/api/friends/:peopleId", authenticateJWT, deleteFriends);

friendRoutes.put("/api/friends/:friendRequestId", authenticateJWT, editFriendStatus);
friendRoutes.get("/api/friends/requests", authenticateJWT, getFriendsRequest);
friendRoutes.get("/api/friends/sent-requests", authenticateJWT, getSentFriendRequests);
friendRoutes.get("/api/friends/accepted", authenticateJWT, getAcceptedFriends);
friendRoutes.get("/api/friends/status/:peopleId", authenticateJWT, getFriendStatusByPeopleId);

export default friendRoutes;
