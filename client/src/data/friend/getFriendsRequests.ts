import { IFriend } from "@/types/IFriend";
import apiClient from "@/utils/apiClient";
import { buildSearchParams } from "@/utils/buildSearchParams";


export const getFriendsRequests = async ({
  pageParam,
}: {
  pageParam: number;
}): Promise<{ data: IFriend[]; currentPage: number; nextPage: number; totalCount: number; totalPages: number }> => {
  const LIMIT = 2;

  const searchParams = {
    page: pageParam.toString(),
    limit: LIMIT.toString(),
  };
  const url = "/api/friends/requests" + buildSearchParams(searchParams);
  const res = await apiClient.get(url);
  return res.data;
};
