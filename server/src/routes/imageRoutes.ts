import { Router } from "express";
import { s3Controllers } from "../controllers/s3.controllers";

const s3Routes = Router();

s3Routes.post("/generate-upload-url", s3Controllers.generatePresignedUrl);
s3Routes.delete("/delete-image", s3Controllers.deleteImageFromS3);
export default s3Routes;
