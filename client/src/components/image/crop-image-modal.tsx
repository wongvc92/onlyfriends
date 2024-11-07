import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { Slider } from "@/components/ui/slider";
import { Dispatch, SetStateAction } from "react";
import { useImageCropContext } from "@/providers/image-crop-provider";
import Spinner from "../ui/spinner";
import { useImageUploadManager } from "@/hooks/useImageUploadManager";
import Cropper from "./cropper";

interface CropImageProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onChange: (url: string) => void;
}
const CropImageModal: React.FC<CropImageProps> = ({ setIsOpen, isOpen, onChange }) => {
  const { uploadSingleImage, deleteSingleImage, isPendingUpload } = useImageUploadManager();
  const { getProcessedImage, resetStates, zoom, setZoom, rotation, setRotation, imageToDelete } = useImageCropContext();

  const handleCropImage = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("handleCropImage imageToDelete", imageToDelete);
    await deleteSingleImage(imageToDelete as string);
    const file = await getProcessedImage();
    if (!file) return;
    const fileToUrl = (await uploadSingleImage(file)) as string;
    onChange(fileToUrl);

    resetStates();
    setIsOpen(false);
  };

  return (
    <Modal title="Edit image" description="Edit Image" isOpen={isOpen} onClose={() => setIsOpen(false)} classname="max-w-[400px]">
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
          <Button type="button" onClick={() => setIsOpen(false)} variant="destructive">
            Cancel
          </Button>
          <Button type="button" onClick={handleCropImage} className="flex items-center gap-2" disabled={isPendingUpload}>
            {isPendingUpload ? (
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

export default CropImageModal;
