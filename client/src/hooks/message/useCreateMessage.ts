import { IMessage } from "@/types/IMessage";
import { IPrivateMessage } from "@/types/IPrivateMessage";
import apiClient from "@/utils/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { messageKeys } from "./messageKeys";
import { useParams } from "@tanstack/react-router";

const sendNewMessage = async ({ privivateMessage }: { privivateMessage: IPrivateMessage }): Promise<IMessage> => {
  const url = "/api/messages";
  const res = await apiClient.post(url, privivateMessage);
  return res.data.newMessage;
};

export const useCreateMessage = () => {
  const queryClient = useQueryClient();
  const { conversationId } = useParams({ from: "/_authenticated/messages/_layout/conversations/_layout/$conversationId/" });
  return useMutation({
    mutationFn: sendNewMessage,
    onSuccess: (newMessage: IMessage) => {
      queryClient.setQueryData(messageKeys.list(conversationId), (oldData: IMessage[] | undefined) => {
        return oldData ? [...oldData, newMessage] : [newMessage];
      });
    },
  });
};
