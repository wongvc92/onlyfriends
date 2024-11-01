import { Request, Response } from "express";
import pool from "../config/db";
import { JwtPayload } from "jsonwebtoken";

export const getPeoples = async (req: Request, res: Response) => {
  const currentUser = req.user as JwtPayload;

  if (!currentUser) {
    res.status(401).json({ message: "Please login" });
  }

  try {
    const peoplesResult = await pool.query(
      `SELECT 
       users.id,
       users.username,
       profiles.name,
       profiles.bio
       FROM users
       LEFT JOIN profiles ON users.id = profiles.user_id
       WHERE users.id !=$1`,
      [currentUser.id]
    );

    const peoples = peoplesResult.rows;
    res.status(200).json({ peoples });
  } catch (error) {
    console.log("Internal server serror", error);
    res.status(500).json({ message: "Failed fetch peoples" });
  }
};
