import { queryOptions } from "@tanstack/react-query";

export const fetchPostsByUserId = async () => {
  const response = await fetch(`http://localhost:5001/api/posts`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }
  const data = await response.json();
  return data;
};

export const postsQueryOptions = queryOptions({
  queryKey: ["posts"],
  queryFn: fetchPostsByUserId,
});
