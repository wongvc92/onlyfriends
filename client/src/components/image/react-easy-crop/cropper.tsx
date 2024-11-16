import { useImageCropContext } from "@/providers/image-crop-provider";
import EasyCropper from "react-easy-crop";

const Cropper = () => {
  const {
    imageToCrop,
    zoom,
    setZoom,
    rotation,
    setRotation,
    crop,
    setCrop,
    onCropComplete,
    aspect,
    cropShape,
  } = useImageCropContext();

  return (
    <EasyCropper
      image={imageToCrop || undefined}
      crop={crop}
      zoom={zoom}
      rotation={rotation}
      cropShape={cropShape}
      aspect={undefined}
      onCropChange={setCrop}
      onCropComplete={onCropComplete}
      onRotationChange={setRotation}
      onZoomChange={setZoom}
      showGrid={true}
      style={{
        containerStyle: {
          position: "relative", // Allows the cropper to fit its parent size
          width: "100%", // Ensures full width inside the modal
          height: "100%", // Ensures full height inside the modal
        },
      }}
    />
  );
};

export default Cropper;
