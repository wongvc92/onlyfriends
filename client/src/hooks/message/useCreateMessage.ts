import { IMessage } from "@/types/IMessage";
import { IPrivateMessage } from "@/types/IPrivateMessage";
import apiClient from "@/utils/apiClient";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { useSetMessageData } from "./useSetMessageData";

const sendNewMessage = async ({ privivateMessage }: { privivateMessage: IPrivateMessage }): Promise<IMessage> => {
  const url = "/api/messages";
  const res = await apiClient.post(url, privivateMessage);
  return res.data.newMessage;
};

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
