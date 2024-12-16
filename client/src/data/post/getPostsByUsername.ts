import { IPost } from "@/types/IPost";
import apiClient from "@/utils/apiClient";
import { buildSearchParams } from "@/utils/basePath";

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

  const searchParams = {
    page: pageParam.toString(),
    limit: LIMIT.toString(),
  };

  const url = `/api/posts/user/${username}` + buildSearchParams(searchParams);
  const res = await apiClient(url);
  return res.data;
};
