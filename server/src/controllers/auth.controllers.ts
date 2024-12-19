import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { authServices } from "../services/auth.services";
import { sendEmailVerificationToken, sendTwoFactorTokenEmail } from "../services/emailServices";
import BadRequestError from "../error/BadRequestError";
import AuthError from "../error/AuthError";
import { asyncHandler } from "../middleware/asyncHandler";
import { HTTPSTATUS } from "../config/http.config";
import {
  createTwoFactorConfirmation,
  deletePasswordResetTokenById,
  deleteTwoFactorTokenByTokenId,
  deleteTwoFactorTokenByTwoFactorConfirmationId,
  generatePasswordResetToken,
  generateTwoFactorToken,
  generateVerificationToken,
  getPasswordResetTokenByToken,
  getTwoFactorConfirmationByUserId,
  getTwoFactorTokenDataByEmail,
  getVerificationToken,
} from "../utils/token";
import { jwtUtils } from "../utils/jwt";
import { config } from "../config/app.config";
import { cookieUtils } from "../utils/cookie";
import { resetPasswordSchema } from "../validation/resetPasswordSchema";
import ResourceNotFoundError from "../error/ResourceNotFoundError";
import { sendPasswordResetEmail } from "../utils/email";
import { newPasswordSchema } from "../validation/newPasswordSchema";

const registerUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { username, password, email } = req.body;

  const existingUsername = await authServices.getExistinguserByUsername(username);
  if (existingUsername) {
    throw new AuthError("Username already exist.");
  }

  const existingEmail = await authServices.getExistingUserByEmail(email);
  if (existingEmail) {
    throw new AuthError("Email already exist.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await authServices.createuser(username, email, hashedPassword);

  const verificationToken = await generateVerificationToken(email);

  await sendEmailVerificationToken(verificationToken.email, username, verificationToken.token);

  res.status(HTTPSTATUS.CREATED).json({ message: "Please check email for confirmation." });
});

const verifyEmailByToken = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.body;

  const existingToken = await getVerificationToken(token);
  if (!existingToken) {
    throw new AuthError("Token not found");
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    throw new AuthError("Token has expired!");
  }

  const existingUser = await authServices.getExistingUserByEmail(existingToken.email);
  if (!existingUser) {
    throw new AuthError("User does not exist!");
  }

  await authServices.updateEmailVerificationStatus(existingToken.email);
  await authServices.deleteVerificationTokenById(existingToken.id);
  res.status(HTTPSTATUS.ACCEPTED).json({ message: "Email verified! Please login." });
});

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, code } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email or password!");
  }

  const existingUser = await authServices.getUserByEmail(email);

  if (!existingUser) {
    throw new AuthError("Email has not registered yet!");
  }

  const isValid = await bcrypt.compare(password, existingUser.password);

  if (!isValid) {
    throw new AuthError("Invalid credentials");
  }

  if (!existingUser.email_verified) {
    const verificationToken = await generateVerificationToken(existingUser.email);
    await sendEmailVerificationToken(verificationToken.email, existingUser.username, verificationToken.token);
    res.status(HTTPSTATUS.CREATED).json({ message: "Please check confirmation email." });
  }

  if (existingUser.is_two_factor_enabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenDataByEmail(email);

      if (!twoFactorToken) {
        throw new AuthError("No token found!");
      }

      if (twoFactorToken.token !== code) {
        throw new AuthError("Invalid code!");
      }
      const hasExpired = new Date(twoFactorToken.expires) < new Date();
      if (hasExpired) {
        throw new AuthError("Code expired");
      }
      await deleteTwoFactorTokenByTokenId(twoFactorToken.id);

      const existingTwoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

      if (existingTwoFactorConfirmation) {
        await deleteTwoFactorTokenByTwoFactorConfirmationId(existingTwoFactorConfirmation.id);
      }
      await createTwoFactorConfirmation(existingUser.id);
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorTokenEmail(existingUser.email, existingUser.username, twoFactorToken.token);
      res.status(HTTPSTATUS.ACCEPTED).json({ twoFactor: true });
    }
  }

  const jwtInfo = {
    id: existingUser.id,
    email: existingUser.email,
    username: existingUser.username,
  };
  // Generate Access Token (short-lived)
  const accessToken = jwtUtils.signToken({ jwtInfo, jwtSecret: config.JWT.ACCESS_TOKEN_SECRET, expiresIn: config.JWT.ACCESS_TOKEN_EXPIRES_IN });

  // Generate Refresh Token (longer-lived)
  const refreshToken = jwtUtils.signToken({ jwtInfo, jwtSecret: config.JWT.REFRESH_TOKEN_SECRET, expiresIn: config.JWT.REFRESH__TOKEN_EXPIRES_IN });

  cookieUtils.setCookie({
    res,
    signedToken: accessToken,
    maxAge: config.cookie.COOKIE_ACCESS_TOKEN_MAX_AGE,
    tokenName: config.JWT.ACCESS_TOKEN_NAME,
  });
  cookieUtils.setCookie({
    res,
    signedToken: refreshToken,
    maxAge: config.cookie.COOKIE_REFRESN_TOKEN_MAX_AGE,
    tokenName: config.JWT.REFRESH_TOKEN_NAME,
  });

  // Optionally, send user data or success message (no need to send the tokens in the body)
  res.status(HTTPSTATUS.OK).json({
    message: "Login successful",
    accessToken,
    user: {
      id: existingUser.id,
      email: existingUser.email,
      username: existingUser.username,
    },
  });
});

const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  cookieUtils.deleteCookie({ res, tokenName: config.JWT.REFRESH_TOKEN_NAME });
  cookieUtils.deleteCookie({ res, tokenName: config.JWT.ACCESS_TOKEN_NAME });

  res.status(HTTPSTATUS.OK).json({ message: "Logged out successfully" });
});

const renewAccessToken = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new AuthError("Refresh token not found");
  }

  const decoded = jwtUtils.decodeToken({ requestToken: refreshToken, tokenSecret: config.JWT.REFRESH_TOKEN_SECRET }) as JwtPayload;

  const jwtInfo = {
    id: decoded.id,
    email: decoded.email,
    username: decoded.username,
  };
  const newAccessToken = jwtUtils.signToken({ jwtInfo, jwtSecret: config.JWT.ACCESS_TOKEN_SECRET, expiresIn: config.JWT.ACCESS_TOKEN_EXPIRES_IN });
  cookieUtils.setCookie({
    res,
    signedToken: newAccessToken,
    maxAge: config.cookie.COOKIE_ACCESS_TOKEN_MAX_AGE,
    tokenName: config.JWT.ACCESS_TOKEN_NAME,
  });

  res.status(HTTPSTATUS.CREATED).json({ accessToken: newAccessToken });
});

const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = resetPasswordSchema.parse(req.body);

  const existingUser = await authServices.getExistingUserByEmail(email);

  if (!existingUser) {
    throw new ResourceNotFoundError("Email not found");
  }

  const passwordResetToken = await generatePasswordResetToken(existingUser.email);

  const { error } = await sendPasswordResetEmail(existingUser.email, passwordResetToken);
  if (error) {
    throw new BadRequestError("Something went wrong, try again later.");
  }
  return res.status(HTTPSTATUS.CREATED).json({ message: "Reset email sent!" });
});

const newPassword = asyncHandler(async (req: Request, res: Response) => {
  const { password, confirmPassword, token } = newPasswordSchema.parse(req.body);

  const passwordResetToken = await getPasswordResetTokenByToken(token);
  if (!passwordResetToken) {
    throw new BadRequestError("Token not found");
  }

  const hasExpired = new Date(passwordResetToken.expires) < new Date();
  if (hasExpired) {
    throw new BadRequestError("Token has expired");
  }

  const existingUser = authServices.getExistingUserByEmail(passwordResetToken.email);

  if (!existingUser) {
    throw new AuthError("User not found");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await authServices.updateUserPasswordByEmail(passwordResetToken.email, hashedPassword);
  await deletePasswordResetTokenById(passwordResetToken.id);

  res.status(HTTPSTATUS.CREATED).json({ message: "Password updated successfully" });
});

export const authControllers = {
  registerUser,
  verifyEmailByToken,
  loginUser,
  logoutUser,
  renewAccessToken,
  resetPassword,
  newPassword,
};
