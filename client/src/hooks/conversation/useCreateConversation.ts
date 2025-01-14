import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { conversationKeys } from "./conversationKeys";
import { createConversation } from "@/api/conversation/createConversation";

export const useCreateConversation = () => {
  const navigate = useNavigate();
  const query = useQueryClient();

  return useMutation({
    mutationFn: createConversation,
    onSuccess: (data: { conversationId: string; username: string }) => {
      const { conversationId, username } = data;

      navigate({ to: `/messages/conversations/${conversationId}?username=${username}` });
      query.invalidateQueries({ queryKey: conversationKeys.all });
    },
  });
};
