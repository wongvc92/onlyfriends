export interface IPost {
  id: string;
  post: string;
  created_at: Date;
  updated_at: Date;
  user_id: string;
  username: string;
  display_image: string;
  name: string;
  images?: {
    id: string;
    url: string;
  }[];
}
