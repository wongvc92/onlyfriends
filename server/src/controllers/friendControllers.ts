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
    res.status(500).json({ message: `Failed remove friend` });
  }
};

export const getFriendsRequest = async (req: Request, res: Response) => {
  const currentUser = req.user as JwtPayload;

  if (!currentUser) {
    res.status(401).json({ message: "Please login" });
    return;
  }
  const page = parseInt(req.query.page as string, 10);
  const limit = parseInt(req.query.limit as string, 10);
  const offset = (page - 1) * limit;
  if (!page || !limit) {
    res.status(401).json({ message: "page or limit is required" });
    return;
  }
  try {
    const totalFriendRequestResult = await pool.query(
      `
       select count(*)
       FROM friends
       WHERE friends.friend_id = $1 AND friends.status = 'pending'
      `,
      [currentUser.id]
    );

    const totalCount = totalFriendRequestResult.rows[0].count;
    const totalPages = Math.ceil(totalCount / limit);

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
      OFFSET $2 LIMIT $3
      `,
      [currentUser.id, offset, limit]
    );

    const friendsRequests = friendsRequestsResult.rows;

    res.status(200).json({ data: friendsRequests, totalCount, nextPage: page < totalPages ? page + 1 : null, totalPages, currentPage: page });
  } catch (error) {
    console.log("Internal server error", error);
    res.status(500).json({ message: "Failed fetch friend request" });
  }
};

export const getAcceptedFriends = async (req: Request, res: Response) => {
  const currentUser = req.user as JwtPayload;

  if (!currentUser) {
    res.status(401).json({ message: "Please login" });
    return;
  }

  const page = parseInt(req.query.page as string, 10);
  const limit = parseInt(req.query.limit as string, 10);
  const offset = (page - 1) * limit;

  try {
    const totalCountResult = await pool.query(
      `
      SELECT COUNT(*)
      FROM friends
      WHERE (friends.friend_id = $1 OR friends.user_id = $1) AND friends.status = 'accepted'
      `,
      [currentUser.id]
    );
    const totalCount = parseInt(totalCountResult.rows[0].total_count, 10);

    const totalPages = Math.ceil(totalCount / limit);
    const friendsRequestsResult = await pool.query(
      `
      SELECT 
        friends.id,
        CASE
          WHEN friends.user_id = $1 THEN friends.friend_id
          ELSE friends.user_id
        END AS user_id,
        users.username,
        profiles.name,
        profiles.bio,
        profiles.location,
        profiles.website
      FROM friends
      JOIN users ON users.id = CASE
        WHEN friends.user_id = $1 THEN friends.friend_id
        ELSE friends.user_id
      END
      LEFT JOIN profiles ON profiles.user_id = users.id
      WHERE (friends.friend_id = $1 OR friends.user_id = $1) AND friends.status = 'accepted'
      LIMIT $2 OFFSET $3
      `,
      [currentUser.id, limit, offset]
    );

    const friendsRequests = friendsRequestsResult.rows;

    res.status(200).json({ data: friendsRequests, currentPage: page, nextPage: page < totalPages ? page + 1 : null, totalCount, totalPages });
  } catch (error) {
    console.log("Internal server serror", error);
    res.status(500).json({ message: "Failed fetch accepted friend" });
  }
};

export const getSentFriendRequests = async (req: Request, res: Response) => {
  const currentUser = req.user as JwtPayload;

  if (!currentUser) {
    res.status(401).json({ message: "Please login" });
    return;
  }

  const page = parseInt(req.query.page as string, 10);
  const limit = parseInt(req.query.limit as string, 10);
  const offset = (page - 1) * limit;

  try {
    // Query to get the total count of sent friend requests
    const totalCountResult = await pool.query(
      `
      SELECT COUNT(*) AS total_count
      FROM friends
      WHERE user_id = $1 AND status = 'pending'
      `,
      [currentUser.id]
    );
    const totalCount = parseInt(totalCountResult.rows[0].total_count, 10);

    const totalPages = Math.ceil(totalCount / limit);
    // Query to get the list of people to whom the user sent friend requests
    const sentRequestsResult = await pool.query(
      `
      SELECT 
        friends.id,
        friends.friend_id AS user_id,
        users.username,
        profiles.name,
        profiles.bio,
        profiles.location,
        profiles.website
      FROM friends
      JOIN users ON users.id = friends.friend_id
      LEFT JOIN profiles ON profiles.user_id = users.id
      WHERE friends.user_id = $1 AND friends.status = 'pending'
      LIMIT $2 OFFSET $3
      `,
      [currentUser.id, limit, offset]
    );

    const sentRequests = sentRequestsResult.rows;

    res.status(200).json({ data: sentRequests, totalCount, nextPage: page < totalPages ? page + 1 : null, currentPage: page, totalPages });
  } catch (error) {
    console.log("Internal server error", error);
    res.status(500).json({ message: "Failed to fetch sent friend requests" });
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

  const peopleId = req.params.peopleId;

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
