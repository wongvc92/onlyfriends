import { getMessagesById } from "@/api/message/getMessagesById";
import { useQuery } from "@tanstack/react-query";
import { messageKeys } from "./messageKeys";

export const useGetMessages = (conversationId?: string) => {
  return useQuery({
    queryKey: messageKeys.list(conversationId as string),
    queryFn: () => getMessagesById(conversationId as string),
    enabled: !!conversationId,
  });
};
