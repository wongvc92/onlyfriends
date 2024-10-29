import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt, VerifiedCallback } from "passport-jwt";
import pool from "./db";
import { IUser } from "../types/Users";
import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

const opts = {
  jwtFromRequest: (req: Request) => {
    console.log("Cookies in request:", req.cookies);
    // Extract JWT from cookies instead of Authorization header
    const token = req.cookies.accessToken;
    return token || null;
  },
  secretOrKey: process.env.JWT_SECRET_KEY!, // Your JWT secret key
};

// JWT Strategy to validate the token
passport.use(
  new JwtStrategy(opts, async (jwtPayload: JwtPayload, done: VerifiedCallback) => {
    try {
      // Find the user associated with the token
      const user = await pool.query("SELECT * FROM users WHERE id = $1", [jwtPayload.id]);

      if (!user.rows[0]) {
        return done(null, false); // No user found
      }

      return done(null, user.rows[0] as IUser); // User authenticated successfully
    } catch (error) {
      return done(error, false);
    }
  })
);

export default passport;
