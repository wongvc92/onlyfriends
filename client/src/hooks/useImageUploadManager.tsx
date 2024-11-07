import { allowedFileSize } from "@/lib/constant";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export const computeSHA256 = async (file: File) => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
};

const BASE_URL = import.meta.env.VITE_SERVER_URL!;

export const validateSingleImage = (fileToUpload: File) => {
  if (!fileToUpload.type.startsWith("image")) {
    toast.error(`Failed to upload image, make sure upload image only`);
    return null;
  } else if (fileToUpload.size >= allowedFileSize) {
    toast.error(`Failed to upload image, max size 1Mb only`);
    return null;
  }
  return fileToUpload;
};

export const useImageUploadManager = () => {
  const [isPendingUpload, setIsPendingUpload] = useState(false);
  const [isPendingDelete, setIsPendingDelete] = useState(false);
  const queryClient = useQueryClient();
  const uploadSingleImage = async (file: File) => {
    const fileToUpload = validateSingleImage(file);
    if (!fileToUpload) return;
    setIsPendingUpload(true);
    const checksum = await computeSHA256(fileToUpload);

    const url = `${BASE_URL}/api/generate-upload-url`;

    let signedUrl = "";
    try {
      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ size: fileToUpload.size.toString(), type: fileToUpload.type, checksum }),
      });
      if (!res.ok) {
        toast.error(`Failed to upload image,please try again`);
        setIsPendingUpload(false);
        return;
      }
      const data = await res.json();

      signedUrl = data.signedURL;
    } catch (error) {
      toast.error(`Failed to upload image,please try again`);
      setIsPendingUpload(false);
    }

    if (!signedUrl) return;

    let fileUrl = "";
    try {
      const res = await fetch(signedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": fileToUpload.type,
        },
        body: fileToUpload,
      });
      if (!res.ok) {
        toast.error(`Failed to upload image, please try again`);
        setIsPendingUpload(false);
        return;
      }
    } catch (error) {
      toast.error(`Failed to upload image, please try again`);
      setIsPendingUpload(false);
    }

    fileUrl = signedUrl?.split("?")[0];
    setIsPendingUpload(false);
    await queryClient.invalidateQueries({ queryKey: ["profiles"] });

    return fileUrl;
  };

  const deleteSingleImage = async (imageUrl: string) => {
    setIsPendingDelete(true);
    const url = `${BASE_URL}/api/delete-image`;
    const key = decodeURIComponent(imageUrl.split(".com/")[1]);

    if (!key || key == undefined) {
      toast.error(`Failed to delete image, please try again.`);
      setIsPendingDelete(false);
      return;
    }
    try {
      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "DELETE",
        credentials: "include",
        body: JSON.stringify({ key }),
      });
      if (!res.ok) {
        toast.error(`Failed to delete image, please try again.`);
        setIsPendingDelete(false);
        return;
      }
    } catch (error) {
      toast.error(`Failed to delete image,please try again`);
      setIsPendingDelete(false);
    }
    setIsPendingDelete(false);
    await queryClient.invalidateQueries({ queryKey: ["profiles"] });
  };

  return { uploadSingleImage, deleteSingleImage, isPendingUpload, isPendingDelete };
};
