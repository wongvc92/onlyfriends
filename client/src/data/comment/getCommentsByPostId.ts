import { IComment } from "@/types/IComment";
import apiClient from "@/utils/apiClient";
import { buildSearchParams } from "@/utils/basePath";

export const getCommentsByPostId = async ({
  pageParam,
  postId,
}: {
  pageParam: number;
  postId: string;
}): Promise<{
  data: IComment[];
  currentPage: number;
  nextPage: number;
  totalComments: number;
}> => {
  const LIMIT = 3;

  const searchParams = {
    page: pageParam.toString(),
    limit: LIMIT.toString(),
  };

  const url = `/api/comments/${postId}` + buildSearchParams(searchParams);
  const res = await apiClient.get(url);
  return res.data;
};
