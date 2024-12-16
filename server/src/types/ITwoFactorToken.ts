export interface ITwoFactorToken {
  id: string; // The primary key, an auto-incrementing integer
  email: string; // The email associated with the token
  token: string; // A 64-character string representing the two-factor authentication token
  expires: Date; // A timestamp indicating when the token expires
}
