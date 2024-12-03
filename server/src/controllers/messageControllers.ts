import { NextFunction, Request, Response } from "express";
import {
  createMessageService,
  getMessagesByConversationIdService,
  getMessagesCountService,
} from "../services/messageServices";
import { io } from "..";

export const getMessagesByConversationId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Hi from getMessagesByConversationId");
  const conversationId = req.params.conversationId;

  if (!conversationId) {
    res.status(401).json({ message: "conversation id  is required." });
  }

  try {
    const messages = await getMessagesByConversationIdService(conversationId);
    res.status(200).json({
      messages,
    });
  } catch (error) {
    next(error);
  }
};

export const createMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const data = req.body;

  const { text, sender_id, recipient_id, conversationId } = data;

  try {
    const newMessage = await createMessageService(
      sender_id,
      recipient_id,
      text,
      conversationId
    );

    io.emit("new_message", newMessage);

    res.status(200).json({ newMessage });
  } catch (error: any) {
    next(error);
  }
};

export const getMessagesCount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const conversationId = req.params.conversationId;
  if (!conversationId) {
    res.status(401).json({ message: "conversation id required." });
  }

  try {
    const totalCount = await getMessagesCountService(conversationId);

    console.log("getMessagesCount", totalCount);
    res.status(200).json({ totalCount });
  } catch (error: any) {
    next(error);
  }
};
