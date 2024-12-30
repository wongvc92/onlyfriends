import pool from "../config/db";
import { IFriend } from "../types/IFriend";

const getExistingFriendRequestCount = async (currentUserId: string, peopleId: string): Promise<number> => {
  const existingRequestResult = await pool.query(
    `SELECT count(*) FROM friends WHERE (user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1);`,
    [currentUserId, peopleId]
  );
  return existingRequestResult.rows[0].count;
};

const createFriend = async (currentUserId: string, peopleId: string) => {
  return await pool.query(`INSERT INTO friends (user_id, friend_id, initiated_by) VALUES ($1, $2, $3);`, [currentUserId, peopleId, currentUserId]);
};

const deleteFriend = async (currentUserId: string, peopleId: string) => {
  await pool.query(
    `
       DELETE FROM friends WHERE    
      (friend_id = $1 AND user_id = $2) 
      OR 
      (friend_id = $2 AND user_id = $1);
    `,
    [peopleId, currentUserId]
  );
};

const getFriendRequestsCount = async (currentUserId: string): Promise<number> => {
  const totalFriendRequestResult = await pool.query(
    `
           select count(*)
           FROM friends
           WHERE friends.friend_id = $1 AND friends.status = 'pending';
          `,
    [currentUserId]
  );

  return totalFriendRequestResult.rows[0].count;
};

const getFriendRequests = async (currentUserId: string, offset: number, limit: number): Promise<IFriend[]> => {
  const friendsRequestsResult = await pool.query(
    `
          SELECT 
            friends.id,
            users.id AS user_id,
            users.username,
            profiles.name,
            profiles.bio,
            profiles.display_image,
            profiles.location,
            profiles.website
          FROM friends
          JOIN users ON users.id = friends.user_id
          LEFT JOIN profiles ON profiles.user_id = users.id
          WHERE friends.friend_id = $1 AND friends.status = 'pending'
          OFFSET $2 LIMIT $3;
          `,
    [currentUserId, offset, limit]
  );

  return friendsRequestsResult.rows;
};

const getAcceptedFriendsCount = async (currentUserId: string, search: string | undefined): Promise<number> => {
  const values: any[] = [currentUserId];
  let queryCondition = `u.id != $1 AND f.status = 'accepted'`;

  if (search) {
    values.push(`%${search}%`);
    queryCondition += ` AND (u.username ILIKE $2)`;
  }

  const totalFriends = await pool.query(
    `
      SELECT COUNT(*)
      FROM users as u
      LEFT JOIN profiles AS p ON u.id = p.user_id
      LEFT JOIN friends AS f
        ON (u.id = f.friend_id AND f.user_id = $1)
        OR (u.id = f.user_id AND f.friend_id = $1)
      WHERE ${queryCondition};
    `,
    values
  );

  return parseInt(totalFriends.rows[0].count, 10);
};

const getAcceptedFriends = async (currentUserId: string, query: string | undefined, limit: number, offset: number): Promise<IFriend[]> => {
  const values = [currentUserId, offset, limit];
  let queryCondition = `f.status = 'accepted'`;

  if (query) {
    values.push(`%${query}%`);
    queryCondition += `AND u.username ILIKE $4`;
  }

  const acceptedFriendsResult = await pool.query(
    `
    SELECT
      f.id,
      u.username,
      u.id as user_id,
      p.display_image,
      p.name,
      p.bio,
      f.status AS friendship_status
    FROM friends AS f
    JOIN users AS u 
      ON (f.friend_id = u.id AND f.user_id = $1)
      OR (f.user_id = u.id AND f.friend_id = $1)
    LEFT JOIN profiles AS p ON u.id = p.user_id
    WHERE ${queryCondition}
    OFFSET $2 LIMIT $3;
    `,
    values
  );

  return acceptedFriendsResult.rows;
};

const getSentFriendRequestsCount = async (currentUserId: string): Promise<number> => {
  // Query to get the total count of sent friend requests
  const totalCountResult = await pool.query(
    `
      SELECT COUNT(*) AS total_count
      FROM friends
      WHERE user_id = $1 AND status = 'pending';
      `,
    [currentUserId]
  );

  return totalCountResult.rows[0].total_count;
};

const getSentFriendRequests = async (currentUserId: string, offset: number, limit: number): Promise<IFriend[]> => {
  const sentRequestsResult = await pool.query(
    `
          SELECT 
            friends.id,
            friends.friend_id AS user_id,
            users.username,
            profiles.name,
            profiles.bio,
            profiles.display_image,
            profiles.location,
            profiles.website
          FROM friends
          JOIN users ON users.id = friends.friend_id
          LEFT JOIN profiles ON profiles.user_id = users.id
          WHERE friends.user_id = $1 AND friends.status = 'pending'
          LIMIT $2 OFFSET $3;
          `,
    [currentUserId, limit, offset]
  );

  return sentRequestsResult.rows;
};

const editFriendStatusById = async (friendRequestId: string) => {
  return await pool.query("UPDATE friends SET status = $1 WHERE id=$2", ["accepted", friendRequestId]);
};

const getFriendStatus = async (peopleId: string, currentUserId: string) => {
  const friendStatusResult = await pool.query(
    `
      SELECT *,
      id AS request_id
      FROM friends
      WHERE 
      (friend_id = $1 AND user_id = $2) 
      OR 
      (friend_id = $2 AND user_id = $1);
      `,
    [peopleId, currentUserId]
  );

  const friendStatus = friendStatusResult.rows[0];

  let isFriend;

  if (friendStatus === undefined) {
    isFriend = false;
  } else {
    isFriend = true;
  }

  return { isFriend, friendStatus };
};

export const friendServices = {
  getExistingFriendRequestCount,
  createFriend,
  deleteFriend,
  getFriendRequestsCount,
  getFriendRequests,
  getAcceptedFriendsCount,
  getAcceptedFriends,
  getSentFriendRequestsCount,
  getSentFriendRequests,
  editFriendStatusById,
  getFriendStatus,
};
