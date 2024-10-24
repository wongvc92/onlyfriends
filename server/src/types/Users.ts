export interface IUser {
  id: number;
  username: string;
  password: string;
  created_at: Date;
  updated_at: Date;
  email: string;
  is_two_factor_enabled: boolean;
  email_verified: Date | null;
}
