import { ConversationsSchema } from "@/routes/_authenticated/messages";
import { Iconversation } from "@/types/IConversation";
import apiClient from "@/utils/apiClient";
import { useQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { conversationKeys } from "./conversationKeys";
import { buildSearchParams } from "@/utils/buildSearchParams";
import { basePath } from "@/utils/basePath";

export const getAllConversations = async (query?: string): Promise<Iconversation[]> => {
  const url = basePath("/api/conversations") + buildSearchParams({ query });
  const res = await apiClient.get(url);
  const { conversations } = res.data;
  return conversations;
};

export const useGetConversations = () => {
  const routeApi = getRouteApi("/_authenticated/messages");
  const routeSearch = routeApi.useSearch();
  const { query } = routeSearch as ConversationsSchema;

  return useQuery({
    queryKey: conversationKeys.list(query || ""),
    queryFn: () => getAllConversations(query),
  });
};
