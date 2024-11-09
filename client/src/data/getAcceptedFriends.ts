import { IFriendsRequest } from "@/types/IFriendsRequest";

const BASE_URL = import.meta.env.VITE_SERVER_URL!;

export const getAcceptedFriends = async ({
  pageParam,
  debouncedSearch,
}: {
  pageParam: number;
  debouncedSearch?: string;
}): Promise<{ data: IFriendsRequest[]; currentPage: number; nextPage: number; totalCount: number; totalPages: number }> => {
  const LIMIT = 10;
  let url = `${BASE_URL}/api/friends/accepted?page=${pageParam}&limit=${LIMIT}`;
  if (debouncedSearch) {
    url = `${BASE_URL}/api/friends/accepted?page=${pageParam}&limit=${LIMIT}&search=${debouncedSearch}`;
  }

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch accepted friends");
  }
  const data = await res.json();
  return data;
};
