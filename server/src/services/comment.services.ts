import pool from "../config/db";

export const addComment = async (post_id: string, comment: string, user_id: string) => {
  await pool.query(
    `
            INSERT INTO 
            comments (post_id, comment, user_id)
            values ($1, $2, $3);
            `,
    [post_id, comment, user_id]
  );
};

export const getCommentsCountByPostId = async (postId: string) => {
  const totalCommentResult = await pool.query(
    `
    SELECT count(*)
    FROM comments
    WHERE post_id = $1;
    `,
    [postId]
  );

  return totalCommentResult.rows[0].count;
};

export const getCommentsByPostId = async (postId: string, limit: number, offset: number) => {
  const commentsResults = await pool.query(
    `
      SELECT 
      comments.* ,
      users.username,
      profiles.name
      FROM comments
      JOIN users on comments.user_id = users.id
      LEFT JOIN profiles ON profiles.user_id = users.id
      Where post_id = $1
      ORDER BY comments.created_at DESC
      LIMIT $2 OFFSET $3;
      `,
    [postId, limit, offset]
  );

  return commentsResults.rows;
};

export const deleteCommentById = async (commentId: string) => {
  await pool.query(
    `
      DELETE 
      FROM comments 
      WHERE id=$1;
    `,
    [commentId]
  );
};

export const editCommentById = async (comment: string, commentId: string) => {
  const commentResult = await pool.query(
    `
      UPDATE comments 
      set comment = $1
      WHERE id=$2
      RETURNING *;
    `,
    [comment, commentId]
  );

  return commentResult.rows[0];
};
export const commentServices = {
  addComment,
  getCommentsCountByPostId,
  getCommentsByPostId,
  deleteCommentById,
  editCommentById,
};
