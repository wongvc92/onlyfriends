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
    const existingRequest = await pool.query(`SELECT * FROM friends WHERE (user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1)`, [
      currentUser.id,
      peopleId,
    ]);

    if (existingRequest.rowCount && existingRequest.rowCount > 0) {
      res.status(400).json({ message: "Friend request already exists" });
      return;
    }

    // Insert the friend request
    await pool.query(`INSERT INTO friends (user_id, friend_id, initiated_by) VALUES ($1, $2, $3)`, [currentUser.id, peopleId, currentUser.id]);

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
  if (!peopleId) {
    res.status(401).json({ message: "peopleId is needed" });
    return;
  }

  console.log("peopleId", peopleId);
  try {
    await pool.query(
      `
        DELETE FROM friends WHERE    
        (friend_id = $1 AND user_id = $2) 
        OR 
        (friend_id = $2 AND user_id = $1)`,
      [peopleId, currentUser.id]
    );

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
    const friendRequestId = req.params.friendRequestId;
    if (!friendRequestId) {
      res.status(401).json({ message: "Please provide friend RequestId" });
      return;
    }

    await pool.query("UPDATE friends SET status = $1 WHERE id=$2", ["accepted", friendRequestId]);
    res.status(200).json({ message: "Succesfully edit status" });
  } catch (error) {
    console.log("Internal server serror", error);
    res.status(500).json({ message: "Failed edit friend status" });
  }
};

export const getFriendStatusByPeopleId = async (req: Request, res: Response) => {
  const currentUser = req.user as JwtPayload;
  if (!currentUser) {
    res.status(401).json({ message: "userId is needed" });
    return;
  }
  console.log("currentUser.id", currentUser.id);
  const peopleId = req.params.peopleId;
  console.log("getFriendStatusByPeopleId", peopleId);
  if (!peopleId) {
    res.status(401).json({ message: "peopleId is needed" });
    return;
  }
  try {
    const friendStatusResult = await pool.query(
      `
    SELECT *,
    id AS request_id
    FROM friends
    WHERE 
    (friend_id = $1 AND user_id = $2) 
    OR 
    (friend_id = $2 AND user_id = $1)
    `,
      [peopleId, currentUser.id]
    );

    const friendStatus = friendStatusResult.rows[0];

    let isFriend;

    if (friendStatus === undefined) {
      isFriend = false;
    } else {
      isFriend = true;
    }

    res.status(200).json({ isFriend, friendStatus });
  } catch (error) {
    console.log("Internal server serror", error);
    res.status(500).json({ message: "Failed fetch friend status" });
  }
};
