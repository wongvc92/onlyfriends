export interface IUser {
  id: string;
  username: string;
  password: string;
  created_at: Date;
  updated_at: Date;
  email: string;
  image: string;
  is_two_factor_enabled: boolean;
  email_verified: Date | null;
}

export interface IUserClient {
  id: string;
  username: string;
  email: string;
}

export interface IUserWithProfile extends IUser {
  name: string | null;
}
