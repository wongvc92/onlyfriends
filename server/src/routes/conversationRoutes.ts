import express from "express";
import {
  createConversation,
  getAllConversations,
} from "../controllers/conversationControllers";

const conversationRoutes = express.Router();

conversationRoutes.post("/", createConversation);
conversationRoutes.get("/", getAllConversations);

export default conversationRoutes;
