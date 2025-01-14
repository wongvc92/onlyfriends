import { IMessage } from "@/types/IMessage";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { useSetMessageData } from "./useSetMessageData";
import { sendNewMessage } from "@/api/message/sendNewMessage";

export const useCreateMessage = () => {
  const { conversationId } = useParams({ from: "/_authenticated/messages/_layout/conversations/_layout/$conversationId/" });
  const { createNewMessage } = useSetMessageData();
  return useMutation({
    mutationFn: sendNewMessage,
    onSuccess: (newMessage: IMessage) => {
      createNewMessage(newMessage, conversationId);
    },
  });
};
