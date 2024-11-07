import { Request, Response } from "express";
import { profileSchema } from "../validation/profileSchema";
import pool from "../config/db";
import { JwtPayload } from "jsonwebtoken";

export const addProfile = async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  if (!user) {
    res.status(401).json({ message: "user not found" });
    return;
  }
  const data = req.body;

  const parsedResult = profileSchema.safeParse(data);

  if (!parsedResult.success) {
    const errorMessage = parsedResult.error.issues.map((issue) => issue.message).join(", ");
    console.log("Failed parsed profile data", errorMessage);
    res.status(401).json({ message: "Please make sure valid info." });
    return;
  }

  const { name, bio, website, location, display_image } = parsedResult.data;

  try {
    await pool.query("INSERT INTO profiles (name, bio, website, location, user_id, display_image) values($1, $2, $3, $4, $5, $6)", [
      name,
      bio,
      website,
      location,
      user.id,
      display_image,
    ]);
    res.status(200).json({ message: "Successfully add profile!" });
  } catch (error) {
    console.log("Internal server serror", error);
    res.status(500).json({ message: "Failed add profile" });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  const username = req.params.username;

  if (!username) {
    res.status(401).json({ message: "Username is required" });
    return;
  }
  try {
    const profileResults = await pool.query(
      `
      SELECT 
      profiles.* ,
      users.username,
      users.created_at as joined_date
      FROM profiles 
      JOIN users ON profiles.user_id = users.id
      WHERE username = $1
      `,
      [username]
    );
    const profile = profileResults.rows[0];
    res.status(200).json({ profile });
  } catch (error) {
    console.log("Internal server serror", error);
    res.status(500).json({ message: "Failed fetch profile" });
  }
};

export const editProfile = async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  if (!user) {
    res.status(401).json({ message: "user not found" });
    return;
  }

  const profileId = req.params.profileId;

  const data = req.body;

  const parsedResult = profileSchema.safeParse(data);

  if (!parsedResult.success) {
    const errorMessage = parsedResult.error.issues.map((issue) => issue.message).join(", ");
    console.log("Failed parsed profile data", errorMessage);
    res.status(401).json({ message: "Please make sure valid info." });
    return;
  }

  const { name, bio, website, location, display_image, banner_image } = parsedResult.data;
  console.log("parsedResult.data", data);

  try {
    await pool.query("UPDATE profiles SET name = $1, bio = $2, website = $3, location = $4, display_image = $5, banner_image = $6 WHERE id = $7", [
      name,
      bio,
      website,
      location,
      display_image,
      banner_image,
      profileId,
    ]);
    res.status(200).json({ message: "Successfully updated profile!" });
  } catch (error) {
    console.log("Internal server serror", error);
    res.status(500).json({ message: "Failed update profile" });
  }
};
