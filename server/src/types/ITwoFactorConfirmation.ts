export interface ITwoFactorConfirmation {
  id: number; // The primary key, an integer
  user_id: string; // UUID of the user, represented as a string
  expires: Date | null; // Expiration timestamp, can be null if not set
}
