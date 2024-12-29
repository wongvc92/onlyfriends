export const commentKeys = {
  all: ["comments"] as const,
  lists: () => [...commentKeys.all, "lists"] as const,
  list: (postId: string) => [...commentKeys.lists(), postId] as const,
  details: () => [...commentKeys.all, "details"] as const,
  detail: (id: string) => [...commentKeys.details(), id] as const,
  count: (postId: string) => [...commentKeys.all, postId] as const,
};
