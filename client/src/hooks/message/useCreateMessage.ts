import { IMessage } from "@/types/IMessage";
import { useMutation } from "@tanstack/react-query";

const sendNewMessage = async (newMessage: {
  text: string;
  sender_id: string | undefined;
  recipient_id: string | undefined;
  conversationId: string;
}): Promise<IMessage> => {
  const res = await fetch("/api/messages", {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newMessage),
  });

  if (!res.ok) {
    throw new Error("Failed create new message");
  }

  const data = await res.json();
  const createdmessage = data.newMessage;
  return createdmessage;
};

export const useCreateMessage = () => {
  return useMutation({
    mutationFn: sendNewMessage,
  });
};
