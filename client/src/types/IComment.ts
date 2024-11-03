export interface IComment {
  id: number;
  comment: string;
  post_id: number;
  user_id: string;
  created_at: Date;
  updated_at: Date;
  username: string;
  name: string;
}
