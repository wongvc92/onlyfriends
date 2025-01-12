import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { HTTPSTATUS } from "../config/http.config";
import { notificationServices } from "../services/notification.services";
import {
  getNotificationSchema,
  getUnopenNotificationByRecipientIdSchema,
  updateNotificationSchema,
  updateUnopenNotificationSchema,
} from "../validation/notificationSchema";
import { IUnOpenNotification } from "../types/INotification";

const getNotificationsByUserId = asyncHandler(async (req: Request, res: Response) => {
  const parsed = getNotificationSchema.parse(req);

  const { params, query } = parsed;
  const { limit, page } = query;
  const { user_id } = params;

  const offset = (page - 1) * limit;
  const notificationsCount = await notificationServices.getNotificationsByUserIdCount(user_id);

  const totalPages = Math.ceil(notificationsCount / limit);

  const notifications = await notificationServices.getNotificationsByUserId({ limit, offset, user_id: user_id });

  res.status(HTTPSTATUS.OK).json({ data: notifications, currentPage: page, nextPage: page < totalPages ? page + 1 : null });
});

const updateNotificationById = asyncHandler(async (req: Request, res: Response) => {
  const parsed = updateNotificationSchema.parse(req);
  const {
    params: { notificationId },
  } = parsed;

  const updatedNotification = await notificationServices.updateNotificationById(notificationId);
  res
    .status(HTTPSTATUS.CREATED)
    .json({ notificationId: updatedNotification.id, recipient_id: updatedNotification.recipient_id, message: "Notification updated" });
});

const getUnopenNotificationsByUserId = asyncHandler(async (req: Request, res: Response) => {
  const parsed = getUnopenNotificationByRecipientIdSchema.parse(req);
  const { params } = parsed;
  const { user_id } = params;
  let unopenNotification: IUnOpenNotification;
  unopenNotification = await notificationServices.getUnopenNotificationByRecipientId(user_id);
  if (unopenNotification === undefined) {
    unopenNotification = await notificationServices.createUnopenNotificationByRecipientId(user_id);
  }

  console.log("getUnopenNotificationsByUserId", unopenNotification);
  res.status(HTTPSTATUS.OK).json({ unopenNotification });
});

const updateUnopenNotificationsByUserId = asyncHandler(async (req: Request, res: Response) => {
  const parsed = updateUnopenNotificationSchema.parse(req);
  const { params, body } = parsed;
  const { user_id } = params;
  const { type } = body;
  let unopenNotification: IUnOpenNotification;
  if (type === "increment") {
    unopenNotification = await notificationServices.updateUnopenNotificationsByUserId(user_id, +1);
  } else if (type === "reset") {
    unopenNotification = await notificationServices.updateUnopenNotificationsByUserId(user_id, 0);
  } else {
    unopenNotification = await notificationServices.updateUnopenNotificationsByUserId(user_id, -1);
  }

  console.log("updateUnopenNotificationsByUserId", unopenNotification);
  res.status(HTTPSTATUS.OK).json({ unopenNotification });
});

export const notificationControllers = {
  getNotificationsByUserId,
  updateNotificationById,
  getUnopenNotificationsByUserId,
  updateUnopenNotificationsByUserId,
};
