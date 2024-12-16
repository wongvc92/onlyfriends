import express from "express";
import { conversationControllers } from "../controllers/conversation.controllers";

const conversationRoutes = express.Router();

conversationRoutes.post("/", conversationControllers.createConversation);
conversationRoutes.get("/", conversationControllers.getAllConversations);

export default conversationRoutes;
