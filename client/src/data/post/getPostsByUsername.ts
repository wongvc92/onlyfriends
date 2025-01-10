import { IPost } from "@/types/IPost";
import apiClient from "@/utils/apiClient";
import { buildSearchParams } from "@/utils/buildSearchParams";
import { getPostByUsernameSchema } from "@/validation/postsSchema";

export interface IGetPostsByUsernameResponse {
  data: IPost[];
  currentPage: number;
  nextPage: number;
}

export const getPostsByUsername = async ({ pageParam, username }: { pageParam: number; username: string }): Promise<IGetPostsByUsernameResponse> => {
  const LIMIT = 10;

  const parsed = getPostByUsernameSchema.safeParse({ params: { username }, query: { pageParam, LIMIT } });
  if (!parsed.success) {
    throw new Error(`${parsed.error.issues[0].message} - ${parsed.error.issues[0].path}`);
  }

  const url = `/api/posts/user/${parsed.data.params.username}` + buildSearchParams(parsed.data.query);

  const res = await apiClient.get(url);
  return res.data;
};
