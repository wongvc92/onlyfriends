import { useRef, useState } from "react";
import { CropIcon, ImageIcon } from "@radix-ui/react-icons";
import { BsXCircleFill } from "react-icons/bs";
import Spinner from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { blobToDataURL } from "@/utils/fileUtils";
import CropImageModal from "./crop-image-modal";
import { useImageCropContext } from "@/context/image-crop";
import { cn } from "@/lib/utils";

interface MultiImageUploaderProps {
  imageShape?: "rounded-full";
  onChange: (images: { url: string }[]) => void;
  value?: { url: string }[];
  type: "single" | "multiple";
}
const MultiImageUploader: React.FC<MultiImageUploaderProps> = ({ onChange, value = [], imageShape, type }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [images, setImages] = useState<{ url: string }[]>([]);
  const { setImageToCrop } = useImageCropContext();
  const [cropIndex, setcropIndex] = useState<number | null>(null);
  const [isPendingUpload, setIsPendingUpload] = useState(false);
  const [isPendingDelete, setisPendingDelete] = useState(false);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    const uploadedImages: { url: string }[] = [];

    for (const file of files) {
      const dataUrl = await blobToDataURL(file); // Convert to data URL
      uploadedImages.push({ url: dataUrl });
    }
    setImages([...images, ...uploadedImages]);
    onChange([...value, ...uploadedImages]); // Append new images to the existing value
  };

  const handleDeleteImage = async (e: React.MouseEvent<HTMLButtonElement>, image: string) => {
    e.preventDefault();
    setisPendingDelete(true);
    setImages((prevImages) => prevImages?.filter((prevImage) => prevImage.url !== image));
    setisPendingDelete(false);
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
    const files = Array.from(e.dataTransfer.files);
    if (!files) return;
    for (const file of files) {
      const dataUrl = await blobToDataURL(file);
      setImages((prevImages) => [...prevImages, { url: dataUrl }]);
    }
  };

  const handleOpenCropModal = (e: React.MouseEvent<HTMLButtonElement>, image: string, i: number) => {
    e.preventDefault();
    setIsOpen(true);
    setImageToCrop(image);
    setcropIndex(i);
  };

  return (
    <>
      {images.map((image, i) => (
        <div key={image.url} className="relative flex w-32 h-32 justify-center items-center">
          <img src={image.url} className={cn(`object-cover w-full h-full`, imageShape)} />
          <Button className="absolute -top-1 -right-1" onClick={(e) => handleDeleteImage(e, image.url)} type="button" size="icon" variant="link">
            {isPendingDelete ? <Spinner size="2" /> : <BsXCircleFill color="gray" />}
          </Button>
          <Button
            className="absolute -top-1 -left-1"
            onClick={(e) => {
              handleOpenCropModal(e, image.url, i);
            }}
            type="button"
            size="icon"
            variant="link"
          >
            {isPendingUpload ? <Spinner size="2" /> : <CropIcon color="gray" />}
          </Button>
        </div>
      ))}

      <Button
        onClick={() => imageInputRef.current?.click()}
        type="button"
        variant="ghost"
        className={cn(`flex justify-center items-center border`, isDragging && "border-sky-500", type === "single" && images.length >= 1 && "hidden")}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleOnDrop}
      >
        <ImageIcon />
        Add image
      </Button>

      <input ref={imageInputRef} hidden multiple type="file" accept="image/*" onChange={handleFileChange} />
      <CropImageModal
        value={value}
        onChange={onChange}
        setImages={setImages}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        cropIndex={cropIndex}
      />
    </>
  );
};

export default MultiImageUploader;
