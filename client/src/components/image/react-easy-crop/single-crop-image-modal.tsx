import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { Slider } from "@/components/ui/slider";
import { useImageCropContext } from "@/context/image-crop";
import Cropper from "./cropper";
import Spinner from "@/components/ui/spinner";
import { blobToDataURL } from "@/utils/fileUtils";
import { useState } from "react";

interface SingleCropImageProps {
  value?: string;
  onChange: (url: string) => void;
  isOpen: boolean;
  onClose: () => void;
}
const SingleCropImageModal: React.FC<SingleCropImageProps> = ({ onClose, isOpen, onChange }) => {
  const { getProcessedImage, resetStates, zoom, setZoom, rotation, setRotation } = useImageCropContext();
  const [isCropping, setIsCropping] = useState(false);
  const handleCropImage = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsCropping(true);
    const file = await getProcessedImage();

    if (!file) {
      // Handle the error or show a notification if the file is invalid
      console.error("Failed to process image");
      return;
    }
    const url = await blobToDataURL(file);
    onChange(url);
    setIsCropping(false);
    resetStates();
    onClose();
  };

  return (
    <Modal title="Edit image" description="Edit Image" isOpen={isOpen} onClose={onClose} classname="max-w-[400px]">
      <div className="space-y-6">
        <div className="h-[300px] w-full">
          <Cropper />
        </div>
        <div className="space-y-2">
          <p>Zoom: {zoom}</p>
          <Slider min={1} max={3} step={0.1} value={[zoom]} onValueChange={(value) => setZoom(value[0])} />
        </div>
        <div className="space-y-2">
          <p>Rotation: {rotation + "°"}</p>
          <Slider min={0} max={360} step={0.1} value={[rotation]} onValueChange={(value) => setRotation(value[0])} />
        </div>
        <div className="flex items-center gap-4 justify-end">
          <Button type="button" onClick={onClose} variant="destructive">
            Cancel
          </Button>
          <Button type="button" onClick={handleCropImage} className="flex items-center gap-2" disabled={isCropping}>
            {isCropping ? (
              <div className="flex items-center gap-2">
                <Spinner size="4" />
                Cropping...
              </div>
            ) : (
              "Crop"
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SingleCropImageModal;
