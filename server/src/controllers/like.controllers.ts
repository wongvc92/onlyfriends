import { Request, Response } from "express";
import AuthError from "../error/AuthError";
import { likeServices } from "../services/like.services";
import { HTTPSTATUS } from "../config/http.config";
import { asyncHandler } from "../middleware/asyncHandler";
import { createlikeSchema, deleteLikeSchema } from "../validation/likeSchema";
import BadRequestError from "../error/BadRequestError";
import { getReceiverSocketId, io } from "../socket/socket";
import { notificationServices } from "../services/notification.services";
import { INotificationSocket } from "../types/INotification";

const createLikeByPostId = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = req.user;
  if (!currentUser) {
    throw new AuthError("Please login");
  }
  const { params, body } = createlikeSchema.parse(req);
  const { postId } = params;
  const { author_id, content } = body;

  const likeCount = await likeServices.getLikeByPostId(postId, currentUser.id);
  if (likeCount === 1) {
    throw new BadRequestError("You already liked the post");
  }

  await likeServices.createLikeByPostId(postId, currentUser.id);
  if (currentUser.id !== author_id) {
    const createdNotification = await notificationServices.createNotification({ content, recipient_id: author_id, source_id: postId, type: "post" });
    await notificationServices.updateUnopenNotificationsByUserId(author_id, +1);

    const receiverSocketId = getReceiverSocketId(author_id);

    if (receiverSocketId) {
      const socketResponse: INotificationSocket = {
        action: "increment",
        type: "post",
        details: { id: postId, name: currentUser.name || currentUser.username, recipient_id: author_id },
        notificationData: createdNotification,
      };

      io.to(receiverSocketId).emit("notification_update", socketResponse);
    }
  }

  res.status(HTTPSTATUS.CREATED).json({ postId, message: "Succesfully like post" });
});

const deleteLikeByPostId = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = req.user;
  if (!currentUser) {
    throw new AuthError("Please login");
  }
  const { params, body } = deleteLikeSchema.parse(req);
  const { postId } = params;
  const { author_id } = body;

  const likeCount = await likeServices.getLikeByPostId(postId, currentUser.id);
  if (likeCount === 0) {
    throw new BadRequestError("You already disliked the post");
  }

  await likeServices.deleteLikeByPostId(postId, currentUser.id);

  if (currentUser.id !== author_id) {
    await notificationServices.updateUnopenNotificationsByUserId(author_id, -1);
    const deletedNotification = await notificationServices.deleteNotification({ recipient_id: author_id, source_id: postId, type: "post" });

    const receivedSocketId = getReceiverSocketId(author_id);

    if (receivedSocketId) {
      const socketResponse: INotificationSocket = {
        action: "decrement",
        type: "post",
        details: { id: postId, name: currentUser.name || currentUser.username, recipient_id: author_id },
        notificationData: deletedNotification,
      };
      io.to(receivedSocketId).emit("notification_update", socketResponse);
    }
  }

  res.status(HTTPSTATUS.OK).json({ postId, message: "Succesfully like post" });
});

export const likeControllers = { createLikeByPostId, deleteLikeByPostId };
