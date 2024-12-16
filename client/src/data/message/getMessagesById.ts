import { IMessage } from "@/types/IMessage";
import apiClient from "@/utils/apiClient";

export const getMessagesById = async (conversationId: string): Promise<IMessage[]> => {
  const url = `/api/messages/${conversationId}`;
  const res = await apiClient.get(url);
  return res.data.messages;
};
