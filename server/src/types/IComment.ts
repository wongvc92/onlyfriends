export interface IComment {
  id: string;
  comment: string;
  post_id: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
  username: string;
  name: string;
  display_image: string;
}
