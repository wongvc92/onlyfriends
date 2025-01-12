import pool from "../config/db";
import { INotification, IUnOpenNotification } from "../types/INotification";

interface ICreateLikeNotificationProps {
  recipient_id: string;
  type: "post";
  content: string;
  source_id: string;
}

const createNotification = async ({ recipient_id, type, content, source_id }: ICreateLikeNotificationProps): Promise<INotification> => {
  const result = await pool.query(
    `
        INSERT INTO notifications
        (recipient_id, type, content, source_id)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `,
    [recipient_id, type, content, source_id]
  );

  return result.rows[0];
};

interface IDeleteLikeNotificationProps {
  recipient_id: string;
  type: "post";
  source_id: string;
}

const deleteNotification = async ({ recipient_id, type, source_id }: IDeleteLikeNotificationProps): Promise<INotification> => {
  const result = await pool.query(
    `
      DELETE FROM notifications as n
      WHERE n.recipient_id = $1 AND n.type = $2 AND n.source_id = $3
      RETURNING *;
    `,
    [recipient_id, type, source_id]
  );
  return result.rows[0];
};

const getNotificationsByUserIdCount = async (user_Id: string): Promise<number> => {
  const results = await pool.query(
    `
      SELECT count(*)
      FROM notifications as n
      WHERE n.recipient_id = $1;
    `,
    [user_Id]
  );
  return results.rows[0].count;
};

interface IGetNotificationsByUserIdProps {
  user_id: string;
  limit: number;
  offset: number;
}

const getNotificationsByUserId = async ({ user_id, limit, offset }: IGetNotificationsByUserIdProps): Promise<INotification[]> => {
  const results = await pool.query(
    `
      SELECT *
      FROM notifications as n
      WHERE n.recipient_id = $1
      ORDER BY n.created_at DESC
      LIMIT $2
      OFFSET $3
 
    `,
    [user_id, limit, offset]
  );
  return results.rows;
};

const updateNotificationById = async (notificationId: string): Promise<INotification> => {
  const result = await pool.query(
    `
      UPDATE notifications
      SET is_read = $1
      WHERE notifications.id = $2
      RETURNING *
    `,
    [true, notificationId]
  );

  return result.rows[0];
};

const createUnopenNotificationByRecipientId = async (user_id: string): Promise<IUnOpenNotification> => {
  const result = await pool.query(
    `
      INSERT INTO user_notifications_meta
      (user_id)
      values ($1)
      RETURNING *
  `,
    [user_id]
  );
  return result.rows[0];
};
const getUnopenNotificationByRecipientId = async (user_id: string): Promise<IUnOpenNotification> => {
  const result = await pool.query(
    `
      SELECT *
      FROM user_notifications_meta as unm
      WHERE unm.user_id = $1
  `,
    [user_id]
  );
  return result.rows[0];
};

const updateUnopenNotificationsByUserId = async (user_id: string, quantity: number): Promise<IUnOpenNotification> => {
  let query: string;
  let values: any[];

  if (quantity === 0) {
    query = `
      UPDATE user_notifications_meta as unm
      SET unopen_notification_count = 0
      WHERE unm.user_id = $1
      RETURNING *
`;
    values = [user_id];
  } else {
    query = `
    UPDATE user_notifications_meta AS unm
    SET unopen_notification_count = GREATEST(unopen_notification_count + $1, 0)
    WHERE unm.user_id = $2
    RETURNING *
  `;
    values = [quantity, user_id];
  }
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const notificationServices = {
  createNotification,
  deleteNotification,
  getNotificationsByUserId,
  getNotificationsByUserIdCount,
  updateNotificationById,
  getUnopenNotificationByRecipientId,
  updateUnopenNotificationsByUserId,
  createUnopenNotificationByRecipientId,
};
