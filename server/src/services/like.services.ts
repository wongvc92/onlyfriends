import pool from "../config/db";

const createLikeByPostId = async (postId: string, currentUserId: string) => {
  await pool.query(
    `
         INSERT INTO likes 
         (post_id, user_id)
         values ($1, $2);
          `,
    [postId, currentUserId]
  );
};

const deleteLikeByPostId = async (postId: string, currentUserId: string) => {
  await pool.query(
    `
         DELETE 
         FROM likes
         WHERE
         post_id = $1 AND user_id = $2;
    `,
    [postId, currentUserId]
  );
};

const getLikeByPostId = async (postId: string, currentUserId: string): Promise<{ isLiked: boolean; likesCount: number }> => {
  const likeResult = await pool.query(
    `
          SELECT * 
          FROM likes 
          WHERE post_id=$1 AND user_id=$2;
    `,
    [postId, currentUserId]
  );
  let isLiked;
  if (likeResult.rowCount === 0) {
    isLiked = false;
  } else {
    isLiked = true;
  }

  const likeCountResult = await pool.query(
    `
        SELECT count(*) as count
        FROM likes
        WHERE
        post_id = $1;
        `,
    [postId]
  );

  const likesCount = likeCountResult.rows[0].count;
  return { isLiked, likesCount };
};
export const likeServices = { createLikeByPostId, deleteLikeByPostId, getLikeByPostId };
