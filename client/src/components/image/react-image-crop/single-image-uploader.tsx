import { useRef, useState } from "react";
import { CropIcon, ImageIcon } from "@radix-ui/react-icons";
import { BsXCircleFill } from "react-icons/bs";
import Spinner from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import CropImageModal from "./crop-image-modal";
import { blobToDataURL } from "@/utils/fileutils";

interface SingleImageUploaderProps {
  onChange: (url: string | null) => void;
  value?: string;
  imageShape?: "rounded-full";
}
const SingleImageUploader: React.FC<SingleImageUploaderProps> = ({
  onChange,
  value,
  imageShape,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [isPendingUpload, setIsPendingUpload] = useState(false);
  const [isPendingDelete, setisPendingDelete] = useState(false);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await blobToDataURL(file);
    setImage(dataUrl);
    onChange(dataUrl);
  };

  console.log("image", image);
  const handleDeleteImage = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!value) return;
    setImage("");
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
    const dataUrl = await blobToDataURL(file);
    setImage(dataUrl);
    onChange(dataUrl);
  };

  const handleOpenCropModal = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    setIsOpen(true);
  };
  return (
    <>
      <div className={`relative w-full flex justify-center items-center`}>
        {isPendingUpload ? (
          <Spinner />
        ) : image ? (
          <>
            <img
              src={image}
              className={`object-cover w-full h-full ${imageShape}`}
            />
            <Button
              className="absolute -top-1 -right-1"
              onClick={handleDeleteImage}
              type="button"
              size="icon"
              variant="link"
            >
              {isPendingDelete ? (
                <Spinner size="2" />
              ) : (
                <BsXCircleFill color="gray" />
              )}
            </Button>
            <Button
              className="absolute -top-1 -left-1"
              onClick={handleOpenCropModal}
              type="button"
              size="icon"
              variant="link"
            >
              {isPendingUpload ? (
                <Spinner size="2" />
              ) : (
                <CropIcon color="gray" />
              )}
            </Button>
          </>
        ) : (
          <Button
            onClick={() => imageInputRef.current?.click()}
            type="button"
            variant="ghost"
            className={`flex justify-center items-center border  ${isDragging && "border-sky-500"} `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleOnDrop}
          >
            <ImageIcon />
            Add image
          </Button>
        )}
      </div>

      <input
        ref={imageInputRef}
        hidden
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
      <CropImageModal
        setImage={setImage}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onChange={onChange}
        src={image as string}
      />
    </>
  );
};

export default SingleImageUploader;
