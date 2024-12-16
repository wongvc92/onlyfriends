import { Request, Response } from "express";
import { signedURLSchema } from "../validation/signedUrlSchema";
import crypto from "crypto";

import { s3Client } from "..";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import AuthError from "../error/AuthError";
import { asyncHandler } from "../middleware/asyncHandler";
import { HTTPSTATUS } from "../config/http.config";
import BadRequestError from "../error/BadRequestError";

const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString("hex");

const generatePresignedUrl = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = req.user;
  if (!currentUser) {
    throw new AuthError("please login.");
  }
  const { type, checksum } = signedURLSchema.parse(req.body);

  const key = `${currentUser.username}_${currentUser.id}/${generateFileName()}`;

  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
    ContentType: type,
    ChecksumSHA256: checksum,
  });

  const signedURL = await getSignedUrl(s3Client, putObjectCommand, { expiresIn: 60 });
  res.status(HTTPSTATUS.CREATED).json({ signedURL });
});

const deleteImageFromS3 = async (req: Request, res: Response) => {
  const currentUser = req.user;
  if (!currentUser) {
    throw new AuthError("please login.");
  }

  const { key } = req.body;
  if (!key || key == undefined) {
    throw new BadRequestError("key is required!");
  }

  const deleteParams = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
  };

  const deleteCommand = new DeleteObjectCommand(deleteParams);

  await s3Client.send(deleteCommand);

  res.status(200).json({ message: "Image deleted successfully from S3." });
};

export const s3Controllers = {
  generatePresignedUrl,
  deleteImageFromS3,
};
