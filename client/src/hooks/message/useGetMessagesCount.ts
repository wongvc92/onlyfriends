import { getMessagesCount } from "@/api/message/getMessagesCount";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";

export const useGetMessagesCount = () => {
  const { conversationId } = useParams({ strict: false });
  const { data: totalCount } = useQuery({
    queryFn: () => getMessagesCount(conversationId as string),
    queryKey: ["messages", conversationId],
    enabled: !!conversationId,
  });

  return { totalCount };
};
