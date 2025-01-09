import { IMessage } from "@/types/IMessage";
import apiClient from "@/utils/apiClient";
import { getMessagesByConversationIdSchema } from "@/validation/messageSchema";

export const getMessagesById = async (conversationId: string): Promise<IMessage[]> => {
  const parsed = getMessagesByConversationIdSchema.safeParse({ conversationId });
  if (!parsed.success) {
    throw new Error(`${parsed.error.issues[0].message} - ${parsed.error.issues[0].path}`);
  }
  const url = `/api/messages/${parsed.data.conversationId}`;
  const res = await apiClient.get(url);
  return res.data.messages;
};
