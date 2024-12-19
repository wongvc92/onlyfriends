export interface IPasswordResetToken {
  id: string;
  expires: Date;
  token: string;
  email: string;
}
