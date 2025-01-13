import { IUser, IUserWithProfile } from "../types/Users";
import pool from "../config/db";

export const getUserByEmail = async (email: string): Promise<IUserWithProfile> => {
  const userData = await pool.query(
    `
    SELECT users.*,
    profiles.name,
    profiles.display_image
    FROM users
    LEFT JOIN profiles ON users.id = profiles.user_id
    WHERE email = $1;
    `,
    [email]
  );

  return userData.rows[0];
};

const getExistinguserByUsername = async (username: string): Promise<IUser> => {
  const usernameData = await pool.query("SELECT * FROM users WHERE username = $1;", [username]);
  return usernameData.rows[0];
};

const getExistingUserByEmail = async (email: string): Promise<IUser> => {
  const emailData = await pool.query("SELECT * FROM users WHERE email = $1;", [email]);
  return emailData.rows[0];
};

const createuser = async (username: string, email: string, hashedPassword: string) => {
  return await pool.query("INSERT INTO users (username, email, password) values($1, $2, $3);", [username, email, hashedPassword]);
};
const updateEmailVerificationStatus = async (email: string) => {
  return await pool.query("UPDATE users SET email_verified = $1 WHERE email = $2;", [new Date(), email]);
};

const updateUserPasswordByEmail = async (hashedPassword: string, email: string) => {
  await pool.query(
    `
      UPDATE users
      SET password=$1
      WHERE email=$2;
    `,
    [email, hashedPassword]
  );
};
const deleteVerificationTokenById = async (id: string) => {
  return await pool.query("DELETE FROM verification_tokens WHERE id = $1;", [id]);
};

const getUsernameById = async (id: string): Promise<string> => {
  const username = await pool.query(
    `
  SELECT username
  FROM users
  WHERE users.id = $1;
  `,
    [id]
  );

  return username.rows[0].username;
};

export const authServices = {
  getUserByEmail,
  getExistinguserByUsername,
  getExistingUserByEmail,
  createuser,
  updateEmailVerificationStatus,
  deleteVerificationTokenById,
  getUsernameById,
  updateUserPasswordByEmail,
};
