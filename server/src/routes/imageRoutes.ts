import { Router } from "express";
import { deleteImageFromS3, generatePresignedUrl } from "../controllers/s3Controllers";
import { authenticateJWT } from "../config/authMiddleware";

const imageRoutes = Router();

imageRoutes.post("/api/generate-upload-url", authenticateJWT, generatePresignedUrl);
imageRoutes.delete("/api/delete-image", authenticateJWT, deleteImageFromS3);
export default imageRoutes;
