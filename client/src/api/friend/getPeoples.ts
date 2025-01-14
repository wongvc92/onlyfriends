import { IPeople } from "@/types/IPeople";
import apiClient from "@/utils/apiClient";
import { buildSearchParams } from "@/utils/buildSearchParams";
import { getPeopleSchema } from "@/validation/peopleValidation";

export const getPeoples = async ({
  pageParam,
  query,
}: {
  pageParam: number;
  query?: string;
}): Promise<{ data: IPeople[]; currentPage: number; nextPage: number; totalCount: number; totalPages: number }> => {
  const LIMIT = 10;

  const parsed = getPeopleSchema.safeParse({ query, pageParam, LIMIT });

  if (!parsed.success) {
    throw new Error(`${parsed.error.issues[0].message} - ${parsed.error.issues[0].path}`);
  }

  const url = "/api/peoples" + buildSearchParams(parsed.data);
  const res = await apiClient.get(url);

  return res.data;
};
