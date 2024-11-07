import { Request, Response } from "express";
import { signedURLSchema } from "../validation/signedUrlSchema";
import crypto from "crypto";
import { JwtPayload } from "jsonwebtoken";
import { s3Client } from "..";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import pool from "../config/db";
const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString("hex");

export const generatePresignedUrl = async (req: Request, res: Response) => {
  const currentUser = req.user as JwtPayload;
  if (!currentUser) {
    res.status(401).json({ message: "Please login" });
    return;
  }
  const data = req.body;
  const parsedResult = signedURLSchema.safeParse(data);
  if (!parsedResult.success) {
    const err = parsedResult.error.issues.map((issue) => `${issue.path} - ${issue.message}`);
    console.log("Failed parsed data: ", err);
    res.status(401).json({ message: "Failed parsed image data" });
    return;
  }

  const { type, checksum } = parsedResult.data;

  const key = `${currentUser.username}_${currentUser.id}/${generateFileName()}`;

  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
    ContentType: type,
    ChecksumSHA256: checksum,
  });

  try {
    const signedURL = await getSignedUrl(s3Client, putObjectCommand, { expiresIn: 60 });
    res.status(200).json({ signedURL });
  } catch (error) {
    console.log("Failed get signed url", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteImageFromS3 = async (req: Request, res: Response) => {
  const currentUser = req.user as JwtPayload;
  if (!currentUser) {
    res.status(401).json({ message: "Please login." });
    return;
  }
  const { key } = req.body;
  if (!key || key == undefined) {
    res.status(401).json({ message: "key is required!" });
    return;
  }
  console.log("deleteImageFromS3 key", key);
  const deleteParams = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
  };
  const deleteCommand = new DeleteObjectCommand(deleteParams);
  try {
    await s3Client.send(deleteCommand);
    await pool.query(
      `
      UPDATE profiles 
      SET
      display_image = $1
      WHERE profiles.user_id = $2
      `,
      ["", currentUser.id]
    );
    res.status(200).json({ message: "Image deleted successfully from S3." });
  } catch (error) {
    console.log("Failed delete url from aws s3", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
