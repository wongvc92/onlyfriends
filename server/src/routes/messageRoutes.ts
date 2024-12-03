import { Router } from "express";

import {
  createMessage,
  getMessagesByConversationId,
  getMessagesCount,
} from "../controllers/messageControllers";

const messageRoutes = Router();

messageRoutes.post("/", createMessage);
messageRoutes.get("/count/:conversationId", getMessagesCount);
messageRoutes.get("/:conversationId", getMessagesByConversationId);

export default messageRoutes;
