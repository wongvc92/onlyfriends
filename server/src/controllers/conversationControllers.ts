import { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import {
  createConversationService,
  getAllConversationsService,
  getConversationService,
} from "../services/conversationServices";
import BadRequestError from "../error/BadRequestError";

export const getAllConversations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const currentUser = req.user as JwtPayload;
    const query = req.query.query as string | undefined;
    const conversations = await getAllConversationsService(
      currentUser.id,
      query
    );
    res.status(200).json({ conversations });
  } catch (error) {
    next(error);
  }
};

export const createConversation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const currentUser = req.user as JwtPayload;

  const { peopleId } = req.body;

  if (!peopleId) {
    throw new BadRequestError("peopleId is required.");
  }
  try {
    const existingConversation = await getConversationService(
      currentUser.id,
      peopleId
    );

    let conversation;

    if (!existingConversation) {
      conversation = await createConversationService(currentUser.id, peopleId);
    } else {
      conversation = existingConversation;
    }

    res.status(200).json({ conversationId: conversation.id });
  } catch (error) {
    next(error);
  }
};
