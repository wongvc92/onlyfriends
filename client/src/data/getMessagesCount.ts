const BASE_URL = import.meta.env.VITE_SERVER_URL!;

export const getMessagesCount = async (
  conversationId: string
): Promise<number> => {
  const url =
    process.env.NODE_ENV === "development"
      ? `${BASE_URL}/api/messages/count/${conversationId}`
      : `/api/messages/count/${conversationId}`;

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch messages count");
  }

  const totalCountData = await res.json();
  const totalCount = totalCountData.totalCount;
  console.log("getMessagesCount", totalCount);
  return totalCount;
};
