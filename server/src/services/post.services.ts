import pool from "../config/db";
import { IPost } from "../types/IPost";

const createpost = async (post: string, currentUserId: string): Promise<IPost> => {
  const createdPost = await pool.query(
    `
        INSERT INTO posts 
        (post, user_id) 
        values ($1,$2)
        RETURNING *;
    `,
    [post, currentUserId]
  );
  return createdPost.rows[0];
};

const createPostImage = async (imageUrl: string, createdPostId: string) => {
  return await pool.query(
    `
        INSERT into post_images
        (url,post_id) values($1,$2);
     `,
    [imageUrl, createdPostId]
  );
};

const editPostById = async (post: string, postId: string) => {
  const editPostResult = await pool.query(
    `
        UPDATE posts 
        SET post = $1
        WHERE id = $2
        RETURNING *;
        `,
    [post, postId]
  );
  return editPostResult.rows[0];
};

const getPostsByUsernameCount = async (username: string): Promise<number> => {
  const totalPostsResult = await pool.query(
    `SELECT COUNT(*) 
        FROM posts
        JOIN users ON posts.user_id = users.id
        WHERE users.username = $1
        `,
    [username]
  );
  return totalPostsResult.rows[0].count;
};

const getPostsByUsername = async (username: string, limit: number, offset: number): Promise<IPost[]> => {
  const postsResult = await pool.query(
    `
        SELECT 
          posts.*,
          users.username,
          profiles.name,
          profiles.bio,
          profiles.location,
          profiles.website,
          profiles.display_image AS display_image,
          COALESCE(
            json_agg(
              json_build_object(
                'id', post_images.id,
                'url', post_images.url
              )
            ) FILTER (WHERE post_images.id IS NOT NULL),
            '[]'
          ) AS images
        FROM posts
        JOIN users ON posts.user_id = users.id
        LEFT JOIN profiles ON profiles.user_id = users.id
        LEFT JOIN post_images ON post_images.post_id = posts.id
        WHERE users.username = $1
        GROUP BY posts.id, users.username, profiles.name, profiles.bio, profiles.location, profiles.website, profiles.display_image
        ORDER BY posts.created_at DESC
        LIMIT $2 OFFSET $3
      `,
    [username, limit, offset]
  );

  return postsResult.rows;
};

const deletePost = async (postId: string, userId: string) => {
  return await pool.query("DELETE from posts WHERE id=$1 AND user_id=$2", [postId, userId]);
};

const getAllPostsCount = async (): Promise<number> => {
  const totalPostsResult = await pool.query("SELECT COUNT(*) FROM posts");
  return totalPostsResult.rows[0].count;
};

const getAllPosts = async (limit: number, offset: number): Promise<IPost[]> => {
  const postsResult = await pool.query(
    `
        SELECT 
          posts.*,
          users.username,
          profiles.name,
          profiles.bio,
          profiles.location,
          profiles.website,
          profiles.display_image as display_image,
          COALESCE(
            json_agg(
              json_build_object(
                'id', post_images.id,
                'url', post_images.url
              )
            ) FILTER (WHERE post_images.id IS NOT NULL),
            '[]'
          ) AS images
        FROM posts
        JOIN users ON posts.user_id = users.id
        LEFT JOIN profiles ON profiles.user_id = users.id
        LEFT JOIN post_images ON post_images.post_id = posts.id
            GROUP BY posts.id, users.username, profiles.name, profiles.bio, profiles.location, profiles.website,profiles.display_image
        ORDER BY posts.created_at DESC
        LIMIT $1 OFFSET $2
      `,
    [limit, offset]
  );

  return postsResult.rows;
};

const getSinglePostById = async (postId: string): Promise<IPost> => {
  const postsResult = await pool.query(
    `
        SELECT 
          posts.*,
          users.username,
          profiles.name,
          profiles.bio,
          profiles.location,
          profiles.website,
          profiles.display_image AS display_image,
          COALESCE(
            json_agg(
              json_build_object(
                'id', post_images.id,
                'url', post_images.url
              )
            ) FILTER (WHERE post_images.id IS NOT NULL),
            '[]'
          ) AS images
        FROM posts
        JOIN users ON posts.user_id = users.id
        LEFT JOIN profiles ON profiles.user_id = users.id
        LEFT JOIN post_images ON post_images.post_id = posts.id
        WHERE posts.id = $1
        GROUP BY posts.id, users.username, profiles.name, profiles.bio, profiles.location, profiles.website, profiles.display_image
        `,
    [postId]
  );

  return postsResult.rows[0];
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
