export interface IVerificationToken {
  id: number;
  expires: Date;
  token: string;
  email: string;
}
