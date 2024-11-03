export const getCommentCountByPostId = async (commentId: number): Promise<{ count: number }> => {
  const url = `http://localhost:5001/api/comments/count/${commentId}`;

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch like");
  }
  const data = await res.json();
  return data;
};
