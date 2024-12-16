export const friendKeys = {
  all: ["friends"] as const,
  lists: () => [...friendKeys.all, "lists"] as const,
  list: (filters: "accepted" | "pending" | "sent" | "all") => [...friendKeys.lists(), { filters }] as const,
  details: () => [...friendKeys.all, "details"] as const,
  detail: (id: string) => [...friendKeys.details(), id] as const,
  status: (peopleId: string) => [...friendKeys.all, "status", peopleId] as const,
};
