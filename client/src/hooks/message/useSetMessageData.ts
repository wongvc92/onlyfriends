import { useQueryClient } from "@tanstack/react-query";
import { messageKeys } from "./messageKeys";
import { IMessage } from "@/types/IMessage";

export const useSetMessageData = () => {
  const queryClient = useQueryClient();
  const createNewMessage = (newMessage: IMessage, conversationId: string) => {
    queryClient.setQueryData(messageKeys.list(conversationId), (oldData: IMessage[] | undefined) => {
      return oldData ? [...oldData, newMessage] : [newMessage];
    });
  };
  return { createNewMessage };
};
