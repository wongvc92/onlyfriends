import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { validate as isUuid } from "uuid";
import pool from "../config/db";

export const addFriends = async (req: Request, res: Response) => {
  const currentUser = req.user as JwtPayload;

  if (!currentUser) {
    res.status(401).json({ message: "Please login" });
  }

  const { peopleId } = req.body;
  if (!isUuid(peopleId)) {
    res.status(401).json({ message: "Please provide correct peopleId" });
  }

  try {
    await pool.query(`INSERT INTO friends (user_id, friend_id) values ($1, $2)`, [currentUser.id, peopleId]);

    res.status(200).json({ message: "Successfully add friend!" });
  } catch (error) {
    console.log("Internal server serror", error);
    res.status(500).json({ message: "Failed add friend" });
  }
};

export const deleteFriends = async (req: Request, res: Response) => {
  const currentUser = req.user as JwtPayload;
  if (!currentUser) {
    res.status(401).json({ message: "Please login" });
  }

  const peopleId = req.params.peopleId;
  if (!isUuid(peopleId)) {
    res.status(401).json({ message: "Please profile correct peopleId" });
  }

  try {
    await pool.query(`DELETE FROM friends WHERE friend_id = $1`, [peopleId]);

    res.status(200).json({ message: "Successfully remove friend!" });
  } catch (error) {
    console.log("Internal server serror", error);
    res.status(500).json({ message: "Failed remove friend" });
  }
};
