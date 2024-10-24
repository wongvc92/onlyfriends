import { Request, Response } from "express";
import pool from "../config/db";
import { sendEmailVerificationToken, sendTwoFactorTokenEmail } from "../services/emailServices";
import { generateTwoFactorToken, generateVerificationToken } from "../services/authServices";
import { IUser } from "../types/Users";
import { ITwoFactorToken } from "../types/ITwoFactorToken";
import { ITwoFactorConfirmation } from "../types/ITwoFactorConfirmation";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password, code } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Please provide email or password!" });
      return;
    }
    console.log("loginUser email", email);
    console.log("loginUser password", password);

    const userData = await pool.query("SELECT * from users where email=$1", [email]);
    console.log("userData", userData);

    if (userData.rows.length === 0) {
      res.status(400).json({ message: "User not found!" });
      return;
    }

    const existingUser: IUser = userData.rows[0];

    const isValid = await bcrypt.compare(password, existingUser.password);
    console.log("passport valid");
    if (!isValid) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    if (!existingUser.email_verified) {
      const verificationToken = await generateVerificationToken(existingUser.email);
      console.log("generateVerificationToken", verificationToken);
      await sendEmailVerificationToken(verificationToken.email, existingUser.username, verificationToken.token);
      res.status(200).json({ message: "Please check confirmation email." });
      return;
    }

    if (existingUser.is_two_factor_enabled && existingUser.email) {
      if (code) {
        console.log("code", code);
        const twoFactorTokenData = await pool.query("SELECT * FROM two_factor_tokens WHERE email = $1", [existingUser.email]);
        const twoFactorToken: ITwoFactorToken = twoFactorTokenData.rows[0];
        console.log("twoFactorToken", twoFactorToken);
        if (!twoFactorToken) {
          res.status(400).json({ message: "Invalid code!" });
          return;
        }

        if (twoFactorToken.token !== code) {
          res.status(400).json({ message: "Invalid code!" });
          return;
        }
        const hasExpired = new Date(twoFactorToken.expires) < new Date();
        if (hasExpired) {
          res.status(400).json({ message: "Code expired" });
          return;
        }

        await pool.query("DELETE FROM two_factor_tokens where id=$1", [twoFactorToken.id]);
        const existingConfirmationData = await pool.query("SELECT * FROM two_factor_confirmations WHERE user_id = $1", [existingUser.id]);
        const existingConfirmation: ITwoFactorConfirmation = existingConfirmationData.rows[0];
        if (existingConfirmation) {
          await pool.query("DELETE FROM two_factor_confirmations WHERE id=$1", [existingConfirmation.id]);
        }

        await pool.query("INSERT INTO two_factor_confirmations (user_id) values($1)", [existingUser.id]);
      } else {
        const twoFactorToken = await generateTwoFactorToken(existingUser.email);
        await sendTwoFactorTokenEmail(existingUser.email, existingUser.username, twoFactorToken.token);
        res.status(200).json({ twoFactor: true });
        return;
      }
    }

    // Generate Access Token (short-lived)
    const accessToken = jwt.sign(
      { id: existingUser.id, email: existingUser.email },
      process.env.JWT_SECRET_KEY!,
      { expiresIn: "15m" } // 15 minutes
    );

    // Generate Refresh Token (longer-lived)
    const refreshToken = jwt.sign(
      { id: existingUser.id },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: "7d" } // 7 days
    );

    // Store the access token in an httpOnly cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use 'true' in production (HTTPS)
      sameSite: "strict", // Protect against CSRF
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    // Store the refresh token in an httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Optionally, send user data or success message (no need to send the tokens in the body)
    res.status(200).json({
      message: "Login successful",
      user: {
        id: existingUser.id,
        email: existingUser.email,
        username: existingUser.username,
      },
    });
  } catch (error) {
    console.log("Internal server error, Failed login user :", error);
    res.status(500).json({ message: "Internal server error, Failed login user" });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.status(401).json({ message: "Refresh token not found" });
    return;
  }

  try {
    // Verify the refresh token
    const userData = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);

    // Type checking: ensure userData is of type JwtPayload
    if (typeof userData === "string") {
      res.status(400).json({ message: "Invalid token format" });
      return;
    }

    // Narrowing the type: userData is now JwtPayload
    const { id, email } = userData as JwtPayload;

    // Check if id and email exist
    if (!id || !email) {
      res.status(400).json({ message: "Invalid token data" });
      return;
    }

    // Generate a new access token
    const newAccessToken = jwt.sign(
      { id: id, email: email },
      process.env.JWT_SECRET_KEY!,
      { expiresIn: "15m" } // Short-lived access token
    );

    // Send the new access token to the client
    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};
