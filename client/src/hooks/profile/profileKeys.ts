export const profileKeys = {
  all: ["profiles"] as const,
  lists: () => [...profileKeys.all, "lists"] as const,
  list: (filters: "accepted" | "pending" | "sent" | "all") => [...profileKeys.lists(), { filters }] as const,
  details: () => [...profileKeys.all, "details"] as const,
  detail: (username: string) => [...profileKeys.details(), username] as const,
};
