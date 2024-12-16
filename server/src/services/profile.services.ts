import pool from "../config/db";
import { IProfile } from "../types/IProfiles";
import { TProfileSchema } from "../validation/profileSchema";

const createProfile = async (profileData: TProfileSchema, currentUserId: string) => {
  const { name, bio, website, location, display_image } = profileData;
  await pool.query("INSERT INTO profiles (name, bio, website, location, user_id, display_image) values($1, $2, $3, $4, $5, $6)", [
    name,
    bio,
    website,
    location,
    currentUserId,
    display_image,
  ]);
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
WHERE u.username = $1
        `,
    [username]
  );
  return profileResults.rows[0];
};

const editProfileById = async (profileData: TProfileSchema, profileId: string) => {
  const { name, bio, website, location, display_image, banner_image } = profileData;
  await pool.query("UPDATE profiles SET name = $1, bio = $2, website = $3, location = $4, display_image = $5, banner_image = $6 WHERE id = $7", [
    name,
    bio,
    website,
    location,
    display_image,
    banner_image,
    profileId,
  ]);
};
export const profileServices = { createProfile, getProfileByUsername, editProfileById };
