const BASE_URL = import.meta.env.VITE_SERVER_URL!;
export const getLikeByPostId = async (postId: number): Promise<{ isLiked: boolean; likesCount: number }> => {
  const url = `${BASE_URL}/api/likes/${postId}`;

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
