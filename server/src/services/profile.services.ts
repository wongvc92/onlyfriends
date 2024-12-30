import pool from "../config/db";
import { IProfile } from "../types/IProfiles";
import { TProfileSchema } from "../validation/profileSchema";

const createProfile = async (profileData: TProfileSchema, currentUserId: string) => {
  const { name, bio, website, location, display_image } = profileData;
  const result = await pool.query(
    `WITH created_profile AS 
      (
        INSERT INTO profiles 
        (name, bio, website, location, user_id, display_image) 
        values($1, $2, $3, $4, $5, $6)
        RETURNING *
       )
        SELECT cp.*,
        users.username,
        users.created_at as joined_date
        FROM created_profile cp
        LEFT JOIN users ON cp.user_id = users.id
    `,
    [name, bio, website, location, currentUserId, display_image]
  );
  return result.rows[0];
};

const getProfileByUsername = async (username: string): Promise<IProfile> => {
  const profileResults = await pool.query(
    `
      SELECT 
      p.id,
      p.name,
      p.banner_image,
      p.display_image,
      p.bio,
      p.location,
      p.website,
      p.updated_at,
      u.id as user_id,
      u.username,
      u.created_at as joined_date
      FROM users as u
      LEFT JOIN profiles AS p ON p.user_id = u.id
      WHERE u.username = $1;
    `,
    [username]
  );

  return profileResults.rows[0];
};

const editProfileById = async (profileData: TProfileSchema, profileId: string): Promise<IProfile> => {
  const { name, bio, website, location, display_image, banner_image } = profileData;
  const result = await pool.query(
    `
    WITH updated_profile AS 
      ( 
        UPDATE profiles 
        SET name = $1, bio = $2, website = $3, location = $4, display_image = $5, banner_image = $6 
        WHERE id = $7
        RETURNING *
      )
      SELECT up.*,
      users.username,
      users.created_at as joined_date
      FROM updated_profile up
      LEFT JOIN users ON up.user_id = users.id
      WHERE up.id = $7
    `,
    [name, bio, website, location, display_image, banner_image, profileId]
  );

  return result.rows[0];
};
export const profileServices = { createProfile, getProfileByUsername, editProfileById };
