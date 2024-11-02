export const getLikeByPostId = async (postId: number): Promise<{ isLiked: boolean; likesCount: number }> => {
  const url = `http://localhost:5001/api/likes/${postId}`;

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
