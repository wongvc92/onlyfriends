import apiClient from "@/utils/apiClient";
import { createConversationSchema } from "@/validation/converstationSchema";

export const createConversation = async (peopleId: string) => {
  const parsed = createConversationSchema.safeParse({ peopleId });
  if (!parsed.success) {
    throw new Error(`${parsed.error.issues[0].message} - ${parsed.error.issues[0].path}`);
  }

  const url = "/api/conversations";
  const res = await apiClient.post(url, { peopleId: parsed.data.peopleId });
  return res.data;
};
