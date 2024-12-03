import { getMessagesById } from "@/data/getMessagesById";
import { useQuery } from "@tanstack/react-query";

export const useGetMessages = (conversationId?: string) => {
  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => getMessagesById(conversationId as string),
    enabled: !!conversationId,
  });
};
