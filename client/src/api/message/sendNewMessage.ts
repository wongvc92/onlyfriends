import { IMessage } from "@/types/IMessage";
import { IPrivateMessage } from "@/types/IPrivateMessage";
import apiClient from "@/utils/apiClient";

export const sendNewMessage = async ({ privivateMessage }: { privivateMessage: IPrivateMessage }): Promise<IMessage> => {
  const url = "/api/messages";
  const res = await apiClient.post(url, privivateMessage);
  return res.data.newMessage;
};
