import { basePath } from "@/utils/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

const createMessage = async (peopleId: string) => {
  const url = basePath("/api/conversations");
  const res = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ peopleId }),
  });
  if (!res.ok) {
    throw new Error("Failed create conversation");
  }

  const data = await res.json();
  return data.conversationId;
};

export const useCreateConversation = () => {
  const navigate = useNavigate();
  const query = useQueryClient();

  return useMutation({
    mutationFn: (peopleId: string) => createMessage(peopleId),
    onSuccess: (conversationId) => {
      console.log("conversationId", conversationId);
      navigate({ to: `/messages/${conversationId}` });
      query.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};
