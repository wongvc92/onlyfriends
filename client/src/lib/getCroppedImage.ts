import { Crop } from "react-image-crop";

interface GetCroppedImageProps {
  src: string;
  crop: Crop;
}

export const getCroppedImage = ({
  src,
  crop,
}: GetCroppedImageProps): Promise<Blob | null> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = src;

    image.onload = () => {
      const canvas = document.createElement("canvas");
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      // Set canvas dimensions based on the crop size
      canvas.width = crop.width ? crop.width * scaleX : 0;
      canvas.height = crop.height ? crop.height * scaleY : 0;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }

      // Draw the image onto the canvas with the crop region
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width * scaleX,
        crop.height * scaleY
      );

      // Convert the canvas to a blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Canvas toBlob failed"));
          }
        },
        "image/jpeg", // You can change the image format if needed
        0.9 // Adjust quality if needed
      );
    };

    image.onerror = (error) => reject(error);
  });
};
