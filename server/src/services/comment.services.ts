import pool from "../config/db";
import { IComment } from "../types/IComment";

export const addComment = async (post_id: string, comment: string, user_id: string): Promise<IComment> => {
  const result = await pool.query(
    `
      WITH inserted_comment AS (
        INSERT INTO 
          comments (post_id, comment, user_id)
          VALUES ($1, $2, $3)
        RETURNING *
      )
      SELECT 
        ic.*, 
        u.username, 
        p.name,
        p.display_image
      FROM inserted_comment ic
      LEFT JOIN users u ON u.id = ic.user_id
      LEFT JOIN profiles p ON p.user_id = ic.user_id;
    `,
    [post_id, comment, user_id]
  );

  return result.rows[0];
};

export const getCommentsCountByPostId = async (postId: string): Promise<number> => {
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

export const getCommentsByPostId = async (postId: string, limit: number, offset: number): Promise<IComment[]> => {
  const commentsResults = await pool.query(
    `
      SELECT 
      comments.* ,
      users.username,
      profiles.name,
      profiles.display_image
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
        WITH updated_comment AS 
        (  
          UPDATE comments 
          set comment = $1
          WHERE id=$2
          RETURNING *
        )
          SELECT
          uc.*,
          u.username,
          p.name,
          p.display_image
          FROM updated_comment uc
          LEFT JOIN users u ON u.id = uc.user_id
          LEFT JOIN profiles p ON p.user_id = uc.user_id;
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
