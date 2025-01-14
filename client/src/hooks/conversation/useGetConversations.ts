import { ConversationsSchema } from "@/routes/_authenticated/messages";
import { useQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { conversationKeys } from "./conversationKeys";
import { getAllConversations } from "@/api/conversation/getAllConversations";

export const useGetConversations = () => {
  const routeApi = getRouteApi("/_authenticated/messages");
  const routeSearch = routeApi.useSearch();
  const { query } = routeSearch as ConversationsSchema;

  return useQuery({
    queryKey: conversationKeys.list(query || ""),
    queryFn: () => getAllConversations(query),
  });
};
