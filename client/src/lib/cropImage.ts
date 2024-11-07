import { Area } from "react-easy-crop";

export const readFile = (file: File) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result), false);
    reader.readAsDataURL(file);
  });
};

export const createImage = (url: string) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); // needed to avoid cross-origin issues on CodeSandbox
    image.src = url;
  });

export function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180;
}

/**
 * Returns the new bounding area of a rotated rectangle.
 */
export function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = getRadianAngle(rotation);

  return {
    width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

/**
 * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
 */
export default async function getCroppedImg(imageSrc: string, pixelCrop: Area, rotation = 0, flip = { horizontal: false, vertical: false }) {
  const image = (await createImage(imageSrc)) as HTMLImageElement;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
  }

  const rotRad = getRadianAngle(rotation);

  // calculate bounding box of the rotated image
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(image.width, image.height, rotation);

  // set canvas size to match the bounding box
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  // translate canvas context to a central location to allow rotating and flipping around the center
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-image.width / 2, -image.height / 2);

  // draw rotated image
  ctx.drawImage(image, 0, 0);

  // croppedAreaPixels values are bounding box relative
  // extract the cropped image using these values
  const data = ctx.getImageData(pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height);

  // set canvas width to final desired crop size - this will clear existing context
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // paste generated rotate image at the top left corner
  ctx.putImageData(data, 0, 0);

  // As Base64 string
  // return canvas.toDataURL('image/jpeg');

  // As a blob
  return new Promise((resolve) => {
    canvas.toBlob(
      (file) => {
        resolve({ file, url: URL.createObjectURL(file as Blob) });
      },
      "image/jpeg",
      0.7
    );
  });
}

/**
 * Convert an image URL to a File object.
 *
 * @param {string} imageUrl - The URL of the image to be converted.
 * @param {string} filename - The name to give the converted file.
 * @param {string} mimeType - The MIME type of the image (e.g., 'image/jpeg', 'image/png').
 * @returns {Promise<File>} - A promise that resolves to a File object.
 */
export const urlToFile = async (imageUrl: string, filename: string, mimeType: string): Promise<File> => {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  return new File([blob], filename, { type: mimeType });
};

// function resizeImage(file: File, maxWidth = 800, maxHeight = 800) {
//   return new Promise((resolve) => {
//     const img = document.createElement("img");
//     img.src = URL.createObjectURL(file);
//     img.onload = () => {
//       const canvas = document.createElement("canvas");
//       const ctx = canvas.getContext("2d");

//       let width = img.width;
//       let height = img.height;

//       if (width > height) {
//         if (width > maxWidth) {
//           height = (height * maxWidth) / width;
//           width = maxWidth;
//         }
//       } else if (height > maxHeight) {
//         width = (width * maxHeight) / height;
//         height = maxHeight;
//       }

//       canvas.width = width;
//       canvas.height = height;
//       ctx.drawImage(img, 0, 0, width, height);
//       canvas.toBlob((blob) => {
//         resolve(new File([blob], file.name, { type: file.type }));
//       }, file.type);
//     };
//   });
// }
