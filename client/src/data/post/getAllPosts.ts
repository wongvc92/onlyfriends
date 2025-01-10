import { IPost } from "@/types/IPost";
import apiClient from "@/utils/apiClient";
import { buildSearchParams } from "@/utils/buildSearchParams";
import { getAllPostSchema } from "@/validation/postsSchema";

export interface IGetAllPostsResponse {
  data: IPost[];
  currentPage: number;
  nextPage: number;
}
export const getAllPosts = async ({ pageParam }: { pageParam: number }): Promise<IGetAllPostsResponse> => {
  const LIMIT = 10;

  const parsed = getAllPostSchema.safeParse({ pageParam, LIMIT });

  if (!parsed.success) {
    throw new Error(`${parsed.error.issues[0].message} - ${parsed.error.issues[0].path}`);
  }

  const url = "/api/posts" + buildSearchParams(parsed.data);
  const res = await apiClient.get(url);
  return res.data;
};
