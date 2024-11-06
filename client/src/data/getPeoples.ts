import { IPeople } from "@/types/IPeople";

const BASE_URL = import.meta.env.VITE_SERVER_URL!;

export const getPeoples = async ({
  pageParam,
}: {
  pageParam: number;
}): Promise<{ data: IPeople[]; currentPage: number; nextPage: number; totalCount: number; totalPages: number }> => {
  const LIMIT = 2;
  const url = `${BASE_URL}/api/peoples?page=${pageParam}&limit=${LIMIT}`;

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch peoples");
  }
  const data = await res.json();
  return data;
};
