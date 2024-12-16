import { Router } from "express";
import { friendControllers } from "../controllers/friend.controllers";

const friendRoutes = Router();

friendRoutes.post("/", friendControllers.createFriend);
friendRoutes.delete("/:peopleId", friendControllers.deleteFriend);
friendRoutes.put("/:friendRequestId", friendControllers.editFriendStatusById);
friendRoutes.get("/requests", friendControllers.getFriendRequests);
friendRoutes.get("/sent-requests", friendControllers.getSentFriendRequests);
friendRoutes.get("/accepted", friendControllers.getAcceptedFriends);
friendRoutes.get("/status/:peopleId", friendControllers.getFriendStatusByPeopleId);

export default friendRoutes;
