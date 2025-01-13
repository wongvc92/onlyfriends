export const peopleKeys = {
  all: ["peoples"] as const,
  lists: () => [...peopleKeys.all, "lists"] as const,
  list: (filters: "accepted" | "pending" | "sent" | "all") => [...peopleKeys.lists(), { filters }] as const,
  query: (filters: "accepted" | "pending" | "sent" | "all", query: string) => [...peopleKeys.list(filters), { query }] as const,
  details: () => [...peopleKeys.all, "details"] as const,
  detail: (id: string) => [...peopleKeys.details(), id] as const,
};
