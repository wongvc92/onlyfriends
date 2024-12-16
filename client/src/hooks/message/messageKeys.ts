export const messageKeys = {
  all: ["messages"] as const,
  lists: () => [...messageKeys.all, "lists"] as const,
  list: (conversaationId: string) => [...messageKeys.lists(), conversaationId] as const,
};
