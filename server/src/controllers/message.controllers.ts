import { Request, Response } from "express";
import { messageServices } from "../services/message.services";
import { asyncHandler } from "../middleware/asyncHandler";
import BadRequestError from "../error/BadRequestError";
import { HTTPSTATUS } from "../config/http.config";
import { messageSchema } from "../validation/messageSchema";
import { getReceiverSocketId, io } from "../socket/socket";

const getMessagesByConversationId = asyncHandler(async (req: Request, res: Response) => {
  const conversationId = req.params.conversationId;

  if (!conversationId) {
    throw new BadRequestError("conversation id  is required.");
  }

  const messages = await messageServices.getMessagesByConversationId(conversationId);
  res.status(HTTPSTATUS.OK).json({
    messages,
  });
});

const createMessage = asyncHandler(async (req: Request, res: Response) => {
  const { text, sender_id, recipient_id, conversationId } = messageSchema.parse(req.body);

  const newMessage = await messageServices.createMessage(sender_id, recipient_id, text, conversationId);

  const receiverSocketId = getReceiverSocketId(newMessage.recipient_id);

  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", newMessage);
  }

  res.status(HTTPSTATUS.CREATED).json({ newMessage });
});

const getMessagesCount = asyncHandler(async (req: Request, res: Response) => {
  const conversationId = req.params.conversationId;
  if (!conversationId) {
    throw new BadRequestError("conversation id  is required.");
  }

  const totalCount = await messageServices.getMessagesCount(conversationId);

  res.status(HTTPSTATUS.OK).json({ totalCount });
});

export const messageControllers = {
  getMessagesByConversationId,
  createMessage,
  getMessagesCount,
};
