import apiClient from "@/utils/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { conversationKeys } from "./conversationKeys";
import { createConversationSchema } from "@/validation/converstationSchema";

const createConversation = async (peopleId: string) => {
  const parsed = createConversationSchema.safeParse({ peopleId });
  if (!parsed.success) {
    throw new Error(`${parsed.error.issues[0].message} - ${parsed.error.issues[0].path}`);
  }

  const url = "/api/conversations";
  const res = await apiClient.post(url, { peopleId: parsed.data.peopleId });
  return res.data;
};

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
