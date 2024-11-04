import { IPost } from "@/types/IPost";

const BASE_URL = import.meta.env.VITE_SERVER_URL!;

export const getAllPosts = async ({
  pageParam,
}: {
  pageParam: number;
}): Promise<{
  data: IPost[];
  currentPage: number;
  nextPage: number;
}> => {
  const LIMIT = 3;
  const response = await fetch(`${BASE_URL}/api/posts/all?page=${pageParam}&limit=${LIMIT}`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }
  const data = await response.json();
  return data;
};
