import { IPeople } from "@/types/IPeople";
import apiClient from "@/utils/apiClient";
import { buildSearchParams } from "@/utils/basePath";

export const getPeoples = async ({
  pageParam,
  query,
}: {
  pageParam: number;
  query?: string;
}): Promise<{ data: IPeople[]; currentPage: number; nextPage: number; totalCount: number; totalPages: number }> => {
  const LIMIT = 2;
  const searchParams = {
    page: pageParam.toString(),
    limit: LIMIT.toString(),
    query,
  };
  const url = "/api/peoples" + buildSearchParams(searchParams);
  const res = await apiClient.get(url);

  return res.data;
};
