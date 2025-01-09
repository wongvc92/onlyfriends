import pool from "../config/db";

const getLikeByPostId = async (postId: string, currentUserId: string): Promise<number> => {
  const result = await pool.query(
    `
    SELECT count(*) 
    from likes
    WHERE post_id = $1 AND likes.user_id = $2;
  `,
    [postId, currentUserId]
  );

  return result.rows[0].count;
};

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

export const likeServices = { createLikeByPostId, deleteLikeByPostId, getLikeByPostId };
