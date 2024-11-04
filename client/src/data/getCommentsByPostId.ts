import { IComment } from "@/types/IComment";

const BASE_URL = import.meta.env.VITE_SERVER_URL!;

export const getCommentsByPostId = async ({
  pageParam,
  postId,
}: {
  pageParam: number;
  postId: number;
}): Promise<{
  data: IComment[];
  currentPage: number;
  nextPage: number;
  totalComments: number;
}> => {
  const LIMIT = 3;
  const url = `${BASE_URL}/api/comments/${postId}?page=${pageParam}&limit=${LIMIT}`;

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch comments");
  }
  const data = await res.json();
  return data;
};
