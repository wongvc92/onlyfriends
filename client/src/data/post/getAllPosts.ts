import { IPost } from "@/types/IPost";
import apiClient from "@/utils/apiClient";
import { buildSearchParams } from "@/utils/buildSearchParams";

export interface IGetAllPostsResponse {
  data: IPost[];
  currentPage: number;
  nextPage: number;
}
export const getAllPosts = async ({ pageParam }: { pageParam: number }): Promise<IGetAllPostsResponse> => {
  const LIMIT = 3;

  const searchParams = {
    page: pageParam.toString(),
    limit: LIMIT.toString(),
  };
  const url = "/api/posts" + buildSearchParams(searchParams);
  const res = await apiClient.get(url);
  return res.data;
};
