import { IFriend } from "@/types/IFriend";
import apiClient from "@/utils/apiClient";
import { buildSearchParams } from "@/utils/buildSearchParams";


export const getAcceptedFriends = async ({
  pageParam,
  query,
}: {
  pageParam: number;
  query?: string;
}): Promise<{ data: IFriend[]; currentPage: number; nextPage: number; totalCount: number; totalPages: number }> => {
  const LIMIT = 10;

  const searchParams = {
    page: pageParam.toString(),
    // query,
    limit: LIMIT.toString(),
  };
  const url = "/api/friends/accepted" + buildSearchParams(searchParams);
  const res = await apiClient.get(url);
  return res.data;
};
