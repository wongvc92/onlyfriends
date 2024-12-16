export const conversationKeys = {
  all: ["conversations"] as const,
  lists: () => [...conversationKeys.all, "lists"] as const,
  list: (filters: string) => [...conversationKeys.lists(), { filters }] as const,
  details: () => [...conversationKeys.all, "details"] as const,
  detail: (id: string) => [...conversationKeys.details(), id] as const,
  count: (id: string) => [...conversationKeys.all, "count", id] as const,
};
