import { ConversationsSchema } from "@/routes/_authenticated/messages";
import { Iconversation } from "@/types/IConversation";
import { basePath, buildSearchParams } from "@/utils/utils";
import { useQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";

export const getAllConversations = async (
  query?: string
): Promise<Iconversation[]> => {
  const url = basePath("/api/conversations") + buildSearchParams({ query });

  console.log("getAllConversations", url);

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch profile");
  }

  const data = await res.json();
  const conversations = data.conversations;

  return conversations;
};

export const useGetConversations = () => {
  const routeApi = getRouteApi("/_authenticated/messages");
  const routeSearch = routeApi.useSearch();
  const { query } = routeSearch as ConversationsSchema;

  return useQuery({
    queryKey: ["conversations", query],
    queryFn: () => getAllConversations(query),
  });
};
