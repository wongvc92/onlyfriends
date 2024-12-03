import pool from "../config/db";

export const addText = async (
  text: string,
  sender_id: string,
  recipient_id: string,
  conversationId: string
) => {
  if (!sender_id || !recipient_id) {
    throw new Error("Missing sender_id or recipient_id");
  }

  if (!text) {
    throw new Error("Missing text");
  }
  try {
    // Insert the message and get its ID
    const insertResult = await pool.query(
      `
        INSERT INTO messages 
        (text, sender_id, recipient_id,conversation_id)
        VALUES ($1, $2, $3, $4)
        RETURNING id
      `,
      [text, sender_id, recipient_id, conversationId]
    );

    const newMessageId = insertResult.rows[0].id;

    // Fetch the additional details with a JOIN
    const newMessageDetails = await pool.query(
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
      WHERE m.id = $1
      ORDER BY m.created_at ASC;
      `,
      [newMessageId]
    );

    return newMessageDetails.rows[0];
  } catch (error) {
    console.error("Error saving message:", error);
    throw error;
  }
};
