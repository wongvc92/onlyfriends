import { Resend } from "resend";
import { config } from "../config/app.config";

const resend = new Resend(config.RESEND.RESEND_API_KEY);
const RESEND_VERIFIED_DOMAIN = config.RESEND.RESEND_VERIFIED_DOMAIN;
const PUBLIC_URL = config.APP_ORIGIN;

export const sendEmailVerificationToken = async (email: string, username: string, verificationToken: string) => {
  if (!PUBLIC_URL) {
    console.log("Missing public URL");
    throw new Error("Missing public URL");
  }

  if (!RESEND_VERIFIED_DOMAIN) {
    console.log("Missing Resend verified domain");
    throw new Error("Missing Resend verified domain");
  }

  try {
    const { data, error } = await resend.emails.send({
      from: `OnlyFriends <email@${RESEND_VERIFIED_DOMAIN}>`, // Set a verified sender address from Resend
      to: email,
      subject: "Welcome to Only Friends!",
      html: `
          <h1>Thank you for registering, ${username}!</h1>
          <p>Click the link below to verify your email address:</p>
          <a href="${PUBLIC_URL}//verify-email?token=${verificationToken}">Verify Email</a>
        `,
    });
    if (error) {
      console.log("Failed to send verification email  :"), error;
      throw new Error("Failed to send verification email");
    }
    return;
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error("Failed to send verification email");
  }
};

export const sendTwoFactorTokenEmail = async (email: string, username: string, token: string) => {
  if (!PUBLIC_URL) {
    console.log("Missing public URL");
    throw new Error("Missing public URL");
  }

  if (!RESEND_VERIFIED_DOMAIN) {
    console.log("Missing Resend verified domain");
    throw new Error("Missing Resend verified domain");
  }

  if (!token || !email || !username) {
    return { error: "Failed send 2FA Code email" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: `OnlyFriends <email@${RESEND_VERIFIED_DOMAIN}>`, // Set a verified sender address from Resend
      to: email,
      subject: "Welcome to Only Friends!",
      html: `
          <h1>Thank you for registering, ${username}!</h1>
          <p>Here is your code: ${token}</p>
         
        `,
    });
    if (error) {
      console.log("Failed send 2FA Code email  :"), error;
      throw new Error("Failed send 2FA Code email");
    }
    return;
  } catch (error) {
    console.error("Failed send 2FA Code email:", error);
    throw new Error("Failed send 2FA Code email");
  }
};
