import apiClient from "@/utils/apiClient";

export const getMessagesCount = async (conversationId: string): Promise<number> => {
  const url = `/api/messages/count/${conversationId}`;
  const res = await apiClient.get(url);
  return res.data.totalCount;
};
