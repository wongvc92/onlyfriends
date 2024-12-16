import { Router } from "express";

import { messageControllers } from "../controllers/message.controllers";

const messageRoutes = Router();

messageRoutes.post("/", messageControllers.createMessage);
messageRoutes.get("/count/:conversationId", messageControllers.getMessagesCount);
messageRoutes.get("/:conversationId", messageControllers.getMessagesByConversationId);

export default messageRoutes;
