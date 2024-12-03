export interface IMessage {
  id: string;
  text: string;
  is_read: boolean;
  created_at: string; // Use Date if you're parsing it later
  sender_id: string;
  sender_username: string;
  sender_name: string | null; // Profiles may not exist
  sender_image: string | null; // Profiles may not exist
  recipient_id: string;
  recipient_username: string;
  recipient_name: string | null; // Profiles may not exist
  recipient_image: string | null; // Profiles may not exist
}
