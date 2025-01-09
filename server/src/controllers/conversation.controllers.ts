import { Request, Response } from "express";
import { conversationServices } from "../services/conversation.services";
import AuthError from "../error/AuthError";
import { asyncHandler } from "../middleware/asyncHandler";
import { createConversationSchema, getAllConversationSchema } from "../validation/conversationSchema";
import { HTTPSTATUS } from "../config/http.config";
import { authServices } from "../services/auth.services";

export const getAllConversations = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = req.user;
  if (!currentUser) {
    throw new AuthError("Please login.");
  }
  const { query } = getAllConversationSchema.parse(req);
  const conversations = await conversationServices.getAllConversations(currentUser.id, query.query);
  res.status(HTTPSTATUS.OK).json({ conversations });
});

export const createConversation = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = req.user;
  if (!currentUser) {
    throw new AuthError("Please login.");
  }
  const { peopleId } = createConversationSchema.parse(req.body);

  const existingConversation = await conversationServices.getConversation(currentUser.id, peopleId);

  let conversation: { id: string };

  if (!existingConversation) {
    conversation = await conversationServices.createConversation(currentUser.id, peopleId);
  } else {
    conversation = existingConversation;
  }

  const username = await authServices.getUsernameById(peopleId);

  res.status(HTTPSTATUS.CREATED).json({ conversationId: conversation.id, username });
});

export const conversationControllers = {
  getAllConversations,
  createConversation,
};
