import { Button } from "@/components/ui/button";
import setCanvasPreview from "@/utils/setCanvasPreview";
import React, { useRef, useState } from "react";
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  Crop,
  makeAspectCrop,
} from "react-image-crop";

const ASPECT_RATIO = 1;

const MIN_DIMENSION = 200;
interface MultiImageCropperProps {
  onChange: (images: { url: string }[]) => void;
  onClose: () => void;
  src: string;
  setImages: React.Dispatch<
    React.SetStateAction<
      {
        url: string;
      }[]
    >
  >;
  cropIndex: number | null;
}

const MultiImageCropper = ({
  onChange,
  src,
  setImages,
  onClose,
  cropIndex,
}: MultiImageCropperProps) => {
  const [crop, setCrop] = useState<Crop>();
  const imageRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setCanvasPreview(
      imageRef.current!,
      canvasRef.current!,
      convertToPixelCrop(
        crop!,
        imageRef.current?.width!,
        imageRef.current?.height!
      )
    );

    const dataUrl = canvasRef.current?.toDataURL();

    if (cropIndex !== null && dataUrl) {
      setImages((prevImages) => {
        const existingImages = [...prevImages];
        existingImages[cropIndex].url = dataUrl;
        onChange(existingImages);
        return existingImages;
      });
    }

    onClose();
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const cropWidthInPercent = (MIN_DIMENSION / width) * 100;

    const crop = makeAspectCrop(
      {
        unit: "%",
        width: cropWidthInPercent,
      },
      ASPECT_RATIO,
      width,
      height
    );
    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
  };
  return (
    <>
      <ReactCrop
        crop={crop}
        onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}
        aspect={undefined}
      >
        <img src={src} alt="Crop me" onLoad={onImageLoad} ref={imageRef} />
      </ReactCrop>
      <Button onClick={handleSave}>Save</Button>
      <canvas ref={canvasRef} />
    </>
  );
};

export default MultiImageCropper;
