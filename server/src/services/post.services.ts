import pool from "../config/db";
import { IPost } from "../types/IPost";

const createpost = async (post: string, currentUserId: string): Promise<IPost> => {
  const createdPost = await pool.query(
    `
    WITH created_post AS 
    (  
      INSERT INTO posts 
      (post, author_id) 
      values ($1,$2)
      RETURNING *
      )
      SELECT cp.*,
      users.username,
      profiles.name,
      profiles.display_image,
      COUNT(DISTINCT likes.id) AS like_count,
      COUNT(DISTINCT comments.id) AS comment_count
      FROM created_post cp
      LEFT JOIN users ON cp.author_id = users.id
      LEFT JOIN profiles ON profiles.user_id = users.id
      LEFT JOIN likes ON likes.post_id = cp.id
      LEFT JOIN comments ON comments.post_id = cp.id
      GROUP BY 
          cp.id,
          cp.post,
          cp.created_at,
          cp.updated_at,
          cp.author_id,
          users.username,
          profiles.name,
          profiles.display_image;
    `,
    [post, currentUserId]
  );
  return createdPost.rows[0];
};

const createPostImage = async (imageUrl: string, createdPostId: string): Promise<{ id: string; url: string }> => {
  const result = await pool.query(
    `
        INSERT into post_images
        (url,post_id) values($1,$2)
        RETURNING id, url;
     `,
    [imageUrl, createdPostId]
  );
  return result.rows[0];
};

const editPostById = async (post: string, postId: string) => {
  const editPostResult = await pool.query(
    `
    WITH edited_post AS 
      (
          UPDATE posts 
          SET post = $1
          WHERE id = $2
          RETURNING *
      )
          SELECT ep.*,
          users.username,
          profiles.name,
          profiles.display_image,
            COALESCE(
              json_agg(
                  json_build_object(
                      'id', post_images.id,
                      'url', post_images.url
                  )
              ) FILTER (WHERE post_images.id IS NOT NULL),
              '[]'
          ) AS images,
          COUNT(DISTINCT likes.id) AS like_count,
          COUNT(DISTINCT comments.id) AS comment_count
          FROM edited_post ep
          LEFT JOIN users ON ep.author_id = users.id
          LEFT JOIN profiles ON profiles.user_id = users.id
          LEFT JOIN post_images ON post_images.post_id = ep.id 
          LEFT JOIN likes ON likes.post_id = ep.id
          LEFT JOIN comments ON comments.post_id = ep.id
          GROUP BY 
              ep.id,
              ep.post,
              ep.created_at,
              ep.updated_at,
              ep.author_id,
              users.username,
              profiles.name,
              profiles.display_image;
        `,
    [post, postId]
  );
  return editPostResult.rows[0];
};

const getPostsByUsernameCount = async (username: string): Promise<number> => {
  const totalPostsResult = await pool.query(
    `SELECT COUNT(*) 
        FROM posts
        JOIN users ON posts.author_id = users.id
        WHERE users.username = $1;
        `,
    [username]
  );
  return totalPostsResult.rows[0].count;
};

const getPostsByUsername = async (userId: string, username: string, limit: number, offset: number): Promise<IPost[]> => {
  const postsResult = await pool.query(
    `
      SELECT 
          posts.id,
          posts.post,
          posts.created_at,
          posts.updated_at,
          posts.author_id,
          users.username,
          profiles.name,
          profiles.display_image,
          COALESCE(
              json_agg(
                  json_build_object(
                      'id', post_images.id,
                      'url', post_images.url
                  )
              ) FILTER (WHERE post_images.id IS NOT NULL),
              '[]'
          ) AS images,
          COUNT(DISTINCT likes.id) AS like_count,
          COUNT(DISTINCT comments.id) AS comment_count,
          CASE 
              WHEN EXISTS (
                  SELECT 1 
                  FROM likes 
                  WHERE likes.post_id = posts.id AND likes.user_id = $3
              ) THEN true 
              ELSE false 
          END AS is_liked
      FROM posts
      JOIN users ON posts.author_id = users.id
      LEFT JOIN profiles ON profiles.user_id = users.id
      LEFT JOIN post_images ON post_images.post_id = posts.id
      LEFT JOIN likes ON likes.post_id = posts.id
      LEFT JOIN comments ON comments.post_id = posts.id
      WHERE users.username = $4
      GROUP BY 
          posts.id,
          users.username,
          profiles.name,
          profiles.display_image
      ORDER BY posts.created_at DESC
      LIMIT $1 OFFSET $2;
    `,
    [limit, offset, userId, username]
  );

  return postsResult.rows;
};

const deletePost = async (postId: string, userId: string) => {
  return await pool.query("DELETE from posts WHERE id=$1 AND author_id=$2", [postId, userId]);
};

const getAllPostsCount = async (): Promise<number> => {
  const totalPostsResult = await pool.query("SELECT COUNT(*) FROM posts");
  return totalPostsResult.rows[0].count;
};

const getAllPosts = async (limit: number, offset: number, userId: string): Promise<IPost[]> => {
  const postsResult = await pool.query(
    `
      SELECT 
          posts.id,
          posts.post,
          posts.author_id,
          posts.created_at,
          posts.updated_at,
          users.username,
          profiles.name,
          profiles.display_image,
          COALESCE(
              json_agg(
                  json_build_object(
                      'id', post_images.id,
                      'url', post_images.url
                  )
              ) FILTER (WHERE post_images.id IS NOT NULL),
              '[]'
          ) AS images,
          COUNT(DISTINCT likes.id) AS like_count,
          COUNT(DISTINCT comments.id) AS comment_count,
          CASE 
              WHEN EXISTS (
                  SELECT 1 
                  FROM likes 
                  WHERE likes.post_id = posts.id AND likes.user_id = $3
              ) THEN true 
              ELSE false 
          END AS is_liked
      FROM posts
      JOIN users ON posts.author_id = users.id
      LEFT JOIN profiles ON profiles.user_id = users.id
      LEFT JOIN post_images ON post_images.post_id = posts.id
      LEFT JOIN likes ON likes.post_id = posts.id
      LEFT JOIN comments ON comments.post_id = posts.id
      GROUP BY 
          posts.id,
          users.username,
          profiles.name,
          display_image
      ORDER BY posts.created_at DESC
      LIMIT $1 OFFSET $2;
    `,
    [limit, offset, userId]
  );

  return postsResult.rows;
};

const getSinglePostById = async (postId: string, userId: string): Promise<IPost> => {
  const postResult = await pool.query(
    `
      SELECT 
          posts.id,
          posts.post,
          posts.created_at,
          posts.updated_at,
          posts.author_id,
          users.username,
          profiles.name,
          profiles.display_image,
          COALESCE(
              json_agg(
                  json_build_object(
                      'id', post_images.id,
                      'url', post_images.url
                  )
              ) FILTER (WHERE post_images.id IS NOT NULL),
              '[]'
          ) AS images,
          COUNT(DISTINCT likes.id) AS like_count,
          COUNT(DISTINCT comments.id) AS comment_count,
          CASE 
              WHEN EXISTS (
                  SELECT 1 
                  FROM likes 
                  WHERE likes.post_id = posts.id AND likes.user_id = $2
              ) THEN true 
              ELSE false 
          END AS is_liked
      FROM posts
      JOIN users ON posts.author_id = users.id
      LEFT JOIN profiles ON profiles.user_id = users.id
      LEFT JOIN post_images ON post_images.post_id = posts.id
      LEFT JOIN likes ON likes.post_id = posts.id
      LEFT JOIN comments ON comments.post_id = posts.id
      WHERE posts.id = $1
      GROUP BY 
          posts.id,
          users.username,
          profiles.name,
          profiles.display_image
    `,
    [postId, userId]
  );

  return postResult.rows[0];
};
export const postServices = {
  createpost,
  createPostImage,
  editPostById,
  getPostsByUsernameCount,
  getPostsByUsername,
  deletePost,
  getAllPostsCount,
  getAllPosts,
  getSinglePostById,
};
