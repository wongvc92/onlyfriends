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

const MIN_DIMENSION = 300;
interface ImageCropperProps {
  onClose: () => void;
  src: string;
  setImage: React.Dispatch<React.SetStateAction<string | null>>;
}
const ImageCropper = ({ src, setImage, onClose }: ImageCropperProps) => {
  const [crop, setCrop] = useState<Crop>();
  const imageRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleSave = async () => {
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
    setImage(dataUrl!);
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
        keepSelection={true} // Allows free resizing and prevents accidental deselection
        ruleOfThirds={true} // Optional: Shows grid overlay
        aspect={undefined}
      >
        <img src={src} alt="Crop me" onLoad={onImageLoad} ref={imageRef} />
      </ReactCrop>
      <Button onClick={handleSave}>Save</Button>
      <canvas
        hidden
        className="mt-4"
        ref={canvasRef}
        style={{
          border: "1px solid black",
          objectFit: "contain",
          width: 300,
          height: 300,
        }}
      />
    </>
  );
};

export default ImageCropper;
