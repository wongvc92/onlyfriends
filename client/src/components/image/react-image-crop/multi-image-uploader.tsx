import { useRef, useState } from "react";
import { ImageIcon } from "@radix-ui/react-icons";
import { BsXCircleFill } from "react-icons/bs";
import Spinner from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { blobToDataURL } from "@/utils/fileUtils";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

interface MultiImageUploaderProps {
  imageShape?: "rounded-full";
  onChange: (images: { url: string }[]) => void;
  value?: { url: string }[];
}
const MultiImageUploader: React.FC<MultiImageUploaderProps> = ({ onChange, value = [], imageShape }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [images, setImages] = useState<{ url: string }[]>([]);
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

  return (
    <>
      <div>
        <Carousel className="w-full">
          <CarouselContent className="-ml-1">
            {images &&
              images.length > 0 &&
              images.map((image, index) => (
                <CarouselItem key={index} className="pl-1 basis-1/2 relative px-2">
                  <img src={image.url} key={image.url} alt={`post image ${index + 1}`} className="object-cover  w-full rounded-md" />
                  <Button
                    className="absolute -top-1 right-1"
                    onClick={(e) => handleDeleteImage(e, image.url)}
                    type="button"
                    size="icon"
                    variant="link"
                  >
                    {isPendingDelete ? <Spinner size="2" /> : <BsXCircleFill color="gray" />}
                  </Button>
                </CarouselItem>
              ))}
          </CarouselContent>
        </Carousel>
      </div>

      <Button
        onClick={() => imageInputRef.current?.click()}
        type="button"
        variant="ghost"
        className={`flex justify-center items-center border ${isDragging && "border-sky-500"}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleOnDrop}
      >
        <ImageIcon />
        Add image
      </Button>

      <input ref={imageInputRef} hidden multiple type="file" accept="image/*" onChange={handleFileChange} />
    </>
  );
};

export default MultiImageUploader;
