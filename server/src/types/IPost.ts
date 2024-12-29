export interface IPost {
  id: string;
  author_id: string;
  post: string;
  username: string;
  name: string;
  display_image: string;
  post_images: { id: string; url: string }[];
  like_count: number;
  comment_count: number;
  is_liked: boolean;
  created_at: Date;
  updated_at: Date;
}
