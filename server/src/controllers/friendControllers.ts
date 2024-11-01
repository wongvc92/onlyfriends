import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { validate as isUuid } from "uuid";
import pool from "../config/db";

export const addFriends = async (req: Request, res: Response) => {
  const currentUser = req.user as JwtPayload;

  if (!currentUser) {
    res.status(401).json({ message: "Please login" });
    return;
  }

  const { peopleId } = req.body;
  if (!isUuid(peopleId)) {
    res.status(401).json({ message: "Please provide correct peopleId" });
    return;
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
    return;
  }

  try {
    await pool.query(`DELETE FROM friends WHERE friend_id = $1`, [peopleId]);

    res.status(200).json({ message: "Successfully remove friend!" });
  } catch (error) {
    console.log("Internal server serror", error);
    res.status(500).json({ message: "Failed remove friend" });
  }
};

export const getFriendsRequest = async (req: Request, res: Response) => {
  const currentUser = req.user as JwtPayload;

  if (!currentUser) {
    res.status(401).json({ message: "Please login" });
    return;
  }

  try {
    const friendsRequestsResult = await pool.query(
      `
      SELECT 
        friends.id,
        users.id AS user_id,
        users.username,
        profiles.name,
        profiles.bio,
        profiles.location,
        profiles.website
      FROM friends
      JOIN users ON users.id = friends.user_id
      LEFT JOIN profiles ON profiles.user_id = users.id
      WHERE friends.friend_id = $1 AND friends.status = 'pending'
      `,
      [currentUser.id]
    );

    const friendsRequests = friendsRequestsResult.rows;

    res.status(200).json({ friendsRequests });
  } catch (error) {
    console.log("Internal server serror", error);
    res.status(500).json({ message: "Failed add friend" });
  }
};

export const editFriendStatus = async (req: Request, res: Response) => {
  try {
    const friendId = req.params.friendRequestId;
    if (!friendId) {
      res.status(401).json({ message: "Please provide friend Id" });
      return;
    }

    await pool.query("UPDATE friends SET status = $1 WHERE id=$2", ["accepted", friendId]);
    res.status(200).json({ message: "Succesfully edit status" });
  } catch (error) {
    console.log("Internal server serror", error);
    res.status(500).json({ message: "Failed edit friend status" });
  }
};
