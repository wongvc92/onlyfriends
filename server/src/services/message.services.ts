import pool from "../config/db";
import { IMessage } from "../types/IMessage";

const getMessagesByConversationId = async (conversationId: string): Promise<IMessage[]> => {
  const messageResult = await pool.query(
    `
        SELECT 
          m.id,
          m.text,
          m.is_read,
          m.created_at,
          s.id AS sender_id,
          s.username AS sender_username,
          sp.name AS sender_name,
          sp.display_image AS sender_image,
          r.id AS recipient_id,
          r.username AS recipient_username,
          rp.name AS recipient_name,
          rp.display_image AS recipient_image
        FROM messages m
        JOIN users s ON m.sender_id = s.id
        LEFT JOIN profiles sp ON sp.user_id = s.id
        JOIN users r ON m.recipient_id = r.id
        LEFT JOIN profiles rp ON rp.user_id = r.id
        WHERE m.conversation_id = $1
        ORDER BY m.created_at ASC;
        `,
    [conversationId]
  );

  return messageResult.rows;
};

const createMessage = async (sender_id: string, recipient_id: string, text: string, conversationId: string): Promise<IMessage> => {
  const newMessageResult = await pool.query(
    `
        INSERT INTO messages
        (sender_id, recipient_id, text, conversation_id)
        values($1, $2, $3, $4)
        RETURNING id;
        `,
    [sender_id, recipient_id, text, conversationId]
  );

  const newMessageId = newMessageResult.rows[0].id;

  const newMessage = await pool.query(
    `
        SELECT 
          m.id,
          m.is_read,
          m.created_at,
          m.text,
          r.id AS recipient_id,
          r.username AS recipient_username,
          rp.name AS recipient_name,
          rp.display_image AS recipient_image,
          s.id AS sender_id, 
          s.username AS sender_username,
          sp.name AS sender_name,
          sp.display_image AS sender_image
          FROM messages m
          JOIN users r ON m.recipient_id = r.id
          LEFT JOIN profiles rp ON m.recipient_id = r.id
          JOIN users s ON m.sender_id  = s.id
          LEFT JOIN profiles sp ON m.sender_id = s.id
          WHERE m.id = $1;
  
        `,
    [newMessageId]
  );

  return newMessage.rows[0];
};

const getMessagesCount = async (conversationId: string): Promise<number> => {
  const totalMessagesResult = await pool.query(
    `
        SELECT count (*)
        FROM messages
        WHERE messages.conversation_id = $1;
        `,
    [conversationId]
  );

  return totalMessagesResult.rows[0].count;
};

export const messageServices = { getMessagesByConversationId, createMessage, getMessagesCount };
