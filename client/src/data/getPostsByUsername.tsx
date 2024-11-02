import { IPost } from "@/types/IPost";

export const getPostsByUsername = async ({
  pageParam,
  username,
}: {
  pageParam: number;
  username: string;
}): Promise<{
  data: IPost[];
  currentPage: number;
  nextPage: number;
}> => {
  const LIMIT = 3;
  const response = await fetch(`http://localhost:5001/api/posts/individual/${username}?page=${pageParam}&limit=${LIMIT}`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }
  const data = await response.json();
  return data;
};
