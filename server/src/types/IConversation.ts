export interface Iconversation {
  id: string; // UUID of the conversation
  created_at: Date; // ISO timestamp when the conversation was created
  sender_id: string; // UUID of the sender
  sender_username: string; // Username of the sender
  sender_name: string | null; // Display name of the sender (nullable)
  sender_image: string | null; // Display image URL of the sender (nullable)
  recipient_id: string; // UUID of the recipient
  recipient_username: string; // Username of the recipient
  recipient_name: string | null; // Display name of the recipient (nullable)
  recipient_image: string | null;
}
