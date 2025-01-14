import { IComment } from "@/types/IComment";
import apiClient from "@/utils/apiClient";
import { buildSearchParams } from "@/utils/buildSearchParams";
import { getCommentsByPostIdSchema } from "@/validation/commentSchema";

export interface IGetCommentsByPostIdResponse {
  data: IComment[];
  currentPage: number;
  nextPage: number;
  totalComments: number;
}
export const getCommentsByPostId = async ({ pageParam, postId }: { pageParam: number; postId: string }): Promise<IGetCommentsByPostIdResponse> => {
  const LIMIT = 10;

  const parsed = getCommentsByPostIdSchema.safeParse({ params: { postId }, query: { page: pageParam.toString(), limit: LIMIT.toString() } });

  if (!parsed.success) {
    throw new Error(`${parsed.error.issues[0].message} - ${parsed.error.errors[0].path}`);
  }

  const { params, query } = parsed.data;
  const url = `/api/comments/${params.postId}` + buildSearchParams(query);
  const res = await apiClient.get(url);
  return res.data;
};
