import crypto from "crypto";
import pool from "../config/db";
import { IVerificationToken } from "../types/VerificationTokens";
import { ITwoFactorToken } from "../types/ITwoFactorToken";

export const generateVerificationToken = async (email: string) => {
  const token = crypto.randomBytes(32).toString("hex");
  console.log("verificationToken created", token);
  const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const existingToken = await pool.query("SELECT * FROM verification_tokens WHERE email = $1", [email]);

  if (existingToken.rows[0] > 0) {
    await pool.query("DELETE FROM verification_tokens WHERE id = $1", [existingToken.rows[0].id]);
  }
  const verificationToken = await pool.query("INSERT INTO verification_tokens (email, token, expires) values($1, $2, $3) RETURNING *", [
    email,
    token,
    verificationTokenExpires,
  ]);

  return verificationToken.rows[0] as IVerificationToken;
};

export const generateTwoFactorToken = async (email: string) => {
  const existingTokenData = await pool.query("SELECT * FROM two_factor_tokens WHERE email = $1", [email]);

  const existingToken: ITwoFactorToken = existingTokenData.rows[0];

  if (existingToken) {
    await pool.query("DELETE FROM two_factor_tokens where id=$1", [existingToken.id]);
  }

  const token = crypto.randomInt(100_00, 1_000_000).toString();
  const expires = new Date(new Date().getTime() + 5 * 60 * 1000); //5 minutes

  const twoFactorToken = await pool.query("INSERT INTO two_factor_tokens (token, email, expires ) values($1, $2, $3) RETURNING *", [
    token,
    email,
    expires,
  ]);

  return twoFactorToken.rows[0] as ITwoFactorToken;
};
