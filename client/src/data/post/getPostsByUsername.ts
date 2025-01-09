import { IPost } from "@/types/IPost";
import apiClient from "@/utils/apiClient";
import { buildSearchParams } from "@/utils/buildSearchParams";


export interface IGetPostsByUsernameResponse {
  data: IPost[];
  currentPage: number;
  nextPage: number;
}

export const getPostsByUsername = async ({ pageParam, username }: { pageParam: number; username: string }): Promise<IGetPostsByUsernameResponse> => {
  const LIMIT = 3;

  const searchParams = {
    page: pageParam.toString(),
    limit: LIMIT.toString(),
  };

  const url = `/api/posts/user/${username}` + buildSearchParams(searchParams);
  const res = await apiClient.get(url);
  return res.data;
};
