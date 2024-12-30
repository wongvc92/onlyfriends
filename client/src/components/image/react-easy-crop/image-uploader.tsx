import { useRef, useState } from "react";
import { CropIcon, ImageIcon } from "@radix-ui/react-icons";
import { useImageCropContext } from "@/context/image-crop";
import { readFile, urlToFile } from "@/lib/cropImage";
import { BsXCircleFill } from "react-icons/bs";
import Spinner from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { blobToDataURL } from "@/utils/fileUtils";
import SingleCropImageModal from "./single-crop-image-modal";

interface ImageUploaderProps {
  onChange: (url: string) => void;
  value?: string;
  imageShape?: "rounded-full";
}
const ImageUploader: React.FC<ImageUploaderProps> = ({ onChange, value, imageShape }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isPendingUpload, setIsPendingUpload] = useState(false);
  const [isPendingDelete, setisPendingDelete] = useState(false);
  const { setImageToCrop, setImageToDelete, aspect } = useImageCropContext();
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setIsPendingUpload(true);
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await blobToDataURL(file);
    if (!dataUrl) return;
    onChange(dataUrl);
    setIsPendingUpload(false);
  };

  const handleDeleteImage = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setisPendingDelete(true);
    if (!value) return;
    onChange("");
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
    const dataUrl = await blobToDataURL(files[0]);
    if (!dataUrl) return;
    onChange(dataUrl);
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
      <SingleCropImageModal isOpen={isOpen} onClose={() => setIsOpen(false)} onChange={onChange} />
    </>
  );
};

export default ImageUploader;
