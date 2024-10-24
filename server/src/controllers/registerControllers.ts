import pool from "../config/db";
import bcrypt from "bcryptjs";
import { sendEmailVerificationToken } from "../services/emailServices";
import { Request, Response } from "express";
import { generateVerificationToken } from "../services/authServices";
import { IVerificationToken } from "../types/VerificationTokens";
import { IUser } from "../types/Users";

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { username, password, email } = req.body;
  console.log("username server", username);
  console.log("password server", password);
  console.log("email server", email);
  try {
    const usernameData = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    if (usernameData.rows.length > 0) {
      res.status(400).json({ message: "Username already exist." });
      return;
    }

    const emailData = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (emailData.rows.length > 0) {
      res.status(400).json({ message: "Email already exist" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query("INSERT INTO users (username, email, password) values($1, $2, $3)", [username, email, hashedPassword]);

    const verificationToken = await generateVerificationToken(email);

    await sendEmailVerificationToken(verificationToken.email, username, verificationToken.token);

    res.status(200).json({ message: "Please check email for confirmation." });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Registration failed" });
  }
};

export const verifyEmailByToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    console.log("token, token");
    const data = await pool.query("SELECT * FROM verification_tokens WHERE token = $1", [token]);
    if (data.rows.length === 0) {
      res.status(400).json({ message: "Token not found" });
      return;
    }

    const existingToken: IVerificationToken = data.rows[0];
    console.log("existingToken", existingToken);
    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
      res.status(400).json({ message: "Token has expired!" });
      return;
    }

    console.log("existingToken.email", existingToken.email);
    const existingUserData = await pool.query("SELECT * FROM users WHERE email = $1", [existingToken.email]);
    if (existingUserData.rows.length === 0) {
      res.status(400).json({ message: "User does not exist!" });
      return;
    }
    const existingUser: IUser = existingUserData.rows[0];
    console.log("existingUser", existingUser);

    await pool.query("UPDATE users SET email_verified = $1 WHERE email = $2", [new Date(), existingUser.email]);
    await pool.query("DELETE FROM verification_tokens WHERE id = $1", [existingToken.id]);
    res.status(200).json({ message: "Email verified! Please login." });
  } catch (error) {
    console.error("Error verify token:", error);
    res.status(500).json({ message: "Verification failed" });
  }
};
