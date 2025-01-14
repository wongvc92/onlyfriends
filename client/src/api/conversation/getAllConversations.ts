import { Iconversation } from "@/types/IConversation";
import apiClient from "@/utils/apiClient";
import { basePath } from "@/utils/basePath";
import { buildSearchParams } from "@/utils/buildSearchParams";
import { getAllConversationSchema } from "@/validation/converstationSchema";

export const getAllConversations = async (query?: string): Promise<Iconversation[]> => {
  const parsed = getAllConversationSchema.safeParse({ query });
  if (!parsed.success) {
    throw new Error(`${parsed.error.issues[0].message} - ${parsed.error.issues[0].path}`);
  }

  const url = basePath("/api/conversations") + buildSearchParams({ query: parsed.data.query });
  const res = await apiClient.get(url);
  const { conversations } = res.data;
  return conversations;
};
