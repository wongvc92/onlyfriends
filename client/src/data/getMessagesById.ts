import { IMessage } from "@/types/IMessage";

const BASE_URL = import.meta.env.VITE_SERVER_URL!;

export const getMessagesById = async (
  conversationId: string
): Promise<IMessage[]> => {
  const url =
    process.env.NODE_ENV === "development"
      ? `${BASE_URL}/api/messages/${conversationId}`
      : `/api/messages/${conversationId}`;

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch messages");
  }

  const data = await res.json();

  return data.messages;
};
