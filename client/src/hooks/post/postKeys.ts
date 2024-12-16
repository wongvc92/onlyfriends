export const postKeys = {
  all: ["posts"] as const, // Base key for all posts
  lists: () => [...postKeys.all, "list"] as const, // For lists of posts
  list: (filters?: Record<string, any>) => [...postKeys.lists(), { filters }] as const, // List with optional filters
  details: () => [...postKeys.all, "details"] as const, // Base key for details
  detail: (postId: string) => [...postKeys.details(), postId] as const, // Specific post details
  userPosts: (username: string) => [...postKeys.lists(), "user", username] as const, // Posts by a specific user
  likes: (postId: string) => [...postKeys.all, "likes", postId],
};
