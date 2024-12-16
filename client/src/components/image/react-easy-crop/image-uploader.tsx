import { useImageUploadManager } from "@/hooks/common/useImageUploadManager";
import { useRef, useState } from "react";
import { PiXCircleBold } from "react-icons/pi";

import { CropIcon, ImageIcon } from "@radix-ui/react-icons";
import { useImageCropContext } from "@/providers/image-crop-provider";
import CropImageModal from "./crop-image-modal";
import { readFile, urlToFile } from "@/lib/cropImage";
import { BsXCircleFill } from "react-icons/bs";
import Spinner from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";

interface ImageUploaderProps {
  onChange: (url: string) => void;
  value?: string;
  imageShape?: "rounded-full";
}
const ImageUploader: React.FC<ImageUploaderProps> = ({ onChange, value, imageShape }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { uploadSingleImage, deleteSingleImage, isPendingUpload, isPendingDelete } = useImageUploadManager();
  const { setImageToCrop, setImageToDelete, aspect } = useImageCropContext();
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const file = e.target.files?.[0];
    if (!file) return;
    const imageUrl = await uploadSingleImage(file);
    if (!imageUrl) return;
    onChange(imageUrl);
  };

  const handleDeleteImage = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!value) return;
    await deleteSingleImage(value);
    onChange("");
  };

  const handleDragOver = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleOnDrop = async (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const imageUrl = await uploadSingleImage(file);
    if (!imageUrl) return;
    onChange(imageUrl);
  };

  const handleOpenCropModal = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsOpen(true);
    if (!value) return;
    const fileToCrop = await urlToFile(value, "image-file.png", "image/png");
    const imageDataUrl = (await readFile(fileToCrop)) as string;
    setImageToCrop(imageDataUrl);
    setImageToDelete(value);
  };
  return (
    <>
      <div className={`relative  h-[200px] aspect-[${aspect}] flex justify-center items-center bg-muted`}>
        {isPendingUpload ? (
          <Spinner />
        ) : value ? (
          <>
            <img src={value} className={`object-cover w-full h-full ${imageShape}`} />
            <Button className="absolute -top-1 -right-1" onClick={handleDeleteImage} type="button" size="icon" variant="link">
              {isPendingDelete ? <Spinner size="2" /> : <BsXCircleFill color="gray" />}
            </Button>
            <Button className="absolute -top-1 -left-1" onClick={handleOpenCropModal} type="button" size="icon" variant="link">
              {isPendingUpload ? <Spinner size="2" /> : <CropIcon color="gray" />}
            </Button>
          </>
        ) : (
          <Button
            onClick={() => imageInputRef.current?.click()}
            type="button"
            variant="ghost"
            className={`aspect-[${aspect}] h-[200px] flex justify-center items-center border  ${isDragging && "border-sky-500"} `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleOnDrop}
          >
            <ImageIcon />
            Add image
          </Button>
        )}
      </div>

      <input ref={imageInputRef} hidden type="file" accept="image/*" onChange={handleFileChange} />
      <CropImageModal isOpen={isOpen} setIsOpen={setIsOpen} onChange={onChange} />
    </>
  );
};

export default ImageUploader;
