import pool from "../config/db";
import { Iconversation } from "../types/IConversation";

export const getConversationService = async (
  currentUserId: string,
  peopleId: string
): Promise<{ id: string }> => {
  const existingConversation = await pool.query(
    `
          SELECT conversations.id FROM conversations
          WHERE (conversations.sender_id = $1 AND conversations.recipient_id = $2)
          OR (conversations.recipient_id = $1 AND conversations.sender_id = $2)
          `,
    [currentUserId, peopleId]
  );
  return existingConversation.rows[0];
};

export const createConversationService = async (
  currentUserId: string,
  peopleId: string
): Promise<{ id: string }> => {
  const createdConversation = await pool.query(
    `
            INSERT INTO conversations
            (sender_id, recipient_id)
            values($1, $2) 
            RETURNING conversations.id
            `,
    [currentUserId, peopleId]
  );
  return createdConversation.rows[0];
};

export const getAllConversationsService = async (
  currentUserId: string,
  query?: string
): Promise<Iconversation[]> => {
  const values: any[] = [currentUserId];
  let queryCondition = `
    (conversations.sender_id = $1 OR conversations.recipient_id = $1)
  `;

  if (query) {
    values.push(`%${query}%`);
    queryCondition += `
      AND (
        recipient_profiles.name ILIKE $2 OR
        latest_message.text ILIKE $2
      )
    `;
  }

  const conversationResult = await pool.query(
    `
      SELECT 
        conversations.id,
        conversations.created_at,
        sender.id AS sender_id,
        sender.username AS sender_username,
        sender_profiles.name AS sender_name,
        sender_profiles.display_image AS sender_image,
        recipient.id AS recipient_id,
        recipient.username AS recipient_username,
        recipient_profiles.name AS recipient_name,
        recipient_profiles.display_image AS recipient_image,
        latest_message.text AS latest_message_text,
        latest_message.created_at AS latest_message_created_at
      FROM conversations
      JOIN users AS sender ON conversations.sender_id = sender.id
      LEFT JOIN profiles AS sender_profiles ON sender_profiles.user_id = sender.id
      JOIN users AS recipient ON conversations.recipient_id = recipient.id
      LEFT JOIN profiles AS recipient_profiles ON recipient_profiles.user_id = recipient.id
      LEFT JOIN LATERAL (
        SELECT text, created_at
        FROM messages
        WHERE messages.conversation_id = conversations.id
        ${
          query
            ? `AND messages.text ILIKE $2` // Add condition to filter messages with query
            : ""
        }
        ORDER BY messages.created_at DESC
        LIMIT 1
      ) AS latest_message ON true
      WHERE ${queryCondition}
      ORDER BY latest_message.created_at DESC NULLS LAST;
    `,
    values
  );

  return conversationResult.rows;
};
