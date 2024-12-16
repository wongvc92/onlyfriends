import apiClient from "@/utils/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { conversationKeys } from "./conversationKeys";

const createMessage = async (peopleId: string) => {
  const url = "/api/conversations";
  const res = await apiClient.post(url, { peopleId });
  return res.data;
};

export const useCreateConversation = () => {
  const navigate = useNavigate();
  const query = useQueryClient();

  return useMutation({
    mutationFn: createMessage,
    onSuccess: (data: { conversationId: string; username: string }) => {
      const { conversationId, username } = data;

      navigate({ to: `/messages/conversations/${conversationId}?username=${username}` });
      query.invalidateQueries({ queryKey: conversationKeys.all });
    },
  });
};
