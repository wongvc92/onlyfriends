import { IPost } from "@/types/IPost";

const BASE_URL = import.meta.env.VITE_SERVER_URL!;

export const getPostByPostId = async (postId: string) => {
  const url = `${BASE_URL}/api/posts/${postId}`;
  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch post");
  }
  const data = await res.json();
  const post: IPost = data.post;
  return post;
};
