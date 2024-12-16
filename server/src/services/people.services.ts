import pool from "../config/db";
import { IPeople } from "../types/IPeople";

const getPeoplesCount = async (currentUserId: string, query?: string): Promise<number> => {
  const values: any[] = [currentUserId];
  let queryCondition = `
    u.id != $1
    AND (f.status IS NULL OR f.status != 'accepted')
  `;

  if (query) {
    values.push(`%${query}%`);
    queryCondition += ` AND (u.username ILIKE $2)`;
  }

  const totalPeoples = await pool.query(
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

  return parseInt(totalPeoples.rows[0].count, 10);
};

const getPeoples = async (currentUserId: string, offset: number, limit: number, query?: string): Promise<IPeople[]> => {
  const values = [currentUserId, offset, limit];
  let queryCondition = `u.id != $1 AND (f.status IS NULL OR (f.status != 'accepted' AND f.status != 'pending'))`;

  if (query) {
    values.push(`%${query}%`);
    queryCondition += `AND u.username ILIKE $4`;
  }

  const peopleResult = await pool.query(
    `

    SELECT
    u.id,
    u.username,
    p.display_image,
    p.name,
    p.bio,
    f.status as friendship_status
    from users as u
    LEFT JOIN profiles AS p ON u.id = p.user_id
    LEFT JOIN friends AS f
    ON ( u.id = f.friend_id AND f.user_id = $1 )
    OR (u.id = f.user_id AND f.friend_id = $1)
    WHERE ${queryCondition}
    OFFSET $2 LIMIT $3
    `,
    values
  );

  return peopleResult.rows;
};

export const poepleServices = { getPeoplesCount, getPeoples };
