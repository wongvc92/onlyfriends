export const notificationKeys = {
  all: ["notifications"] as const, // Base key for all posts
  lists: () => [...notificationKeys.all, "list"] as const, // For lists of posts
  list: (filters?: Record<string, any>) => [...notificationKeys.lists(), { filters }] as const, // List with optional filters
  userNotifications: (userId: string) => [...notificationKeys.lists(), userId] as const, // Posts by a specific user
  userUnopenNofications: (userId: string) => [...notificationKeys.lists(), userId, "unopen"] as const,
};
