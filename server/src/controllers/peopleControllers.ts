import { Request, Response } from "express";
import pool from "../config/db";
import { JwtPayload } from "jsonwebtoken";

export const getPeoples = async (req: Request, res: Response) => {
  const currentUser = req.user as JwtPayload;

  if (!currentUser) {
    res.status(401).json({ message: "Please login" });
    return;
  }

  const page = parseInt(req.query.page as string, 10);
  const limit = parseInt(req.query.limit as string, 10);
  const offset = (page - 1) * limit;

  try {
    const totalPeoples = await pool.query(
      `
        SELECT COUNT(*)
        FROM users
        LEFT JOIN friends 
          ON (users.id = friends.friend_id AND friends.user_id = $1)
          OR (users.id = friends.user_id AND friends.friend_id = $1)
        WHERE users.id != $1
          AND friends.status IS NULL
      `,
      [currentUser.id]
    );

    const totalCount = totalPeoples.rows[0].count;
    const totalPages = Math.ceil(totalCount / limit);

    const peoplesResult = await pool.query(
      `
      SELECT 
        users.id,
        users.username,
        profiles.name,
        profiles.bio,
        friends.status as friendship_status
      FROM users
      LEFT JOIN profiles ON users.id = profiles.user_id
      LEFT JOIN friends 
        ON (users.id = friends.friend_id AND friends.user_id = $1)
        OR (users.id = friends.user_id AND friends.friend_id = $1)
      WHERE users.id != $1
        AND (friends.status IS NULL)
      OFFSET $2 LIMIT $3
      `,
      [currentUser.id, offset, limit]
    );

    const peoples = peoplesResult.rows;
    res.status(200).json({ data: peoples, currentPage: page, totalCount, nextPage: page < totalPages ? page + 1 : null, totalPages });
  } catch (error) {
    console.log("Internal server error", error);
    res.status(500).json({ message: "Failed to fetch peoples" });
  }
};
