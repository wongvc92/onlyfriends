import { Router } from "express";
import { notificationControllers } from "../controllers/notification.controllers";

const notificationRoutes = Router();

notificationRoutes.get("/:user_id", notificationControllers.getNotificationsByUserId);
notificationRoutes.put("/:notificationId/read", notificationControllers.updateNotificationById);
notificationRoutes.get("/:user_id/unopen", notificationControllers.getUnopenNotificationsByUserId);
notificationRoutes.put("/:user_id/unopen", notificationControllers.updateUnopenNotificationsByUserId);

export default notificationRoutes;
