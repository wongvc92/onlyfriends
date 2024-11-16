import Modal from "@/components/ui/modal";

import "react-image-crop/dist/ReactCrop.css";
import MultiImageCropper from "./multi-image-cropper";
interface CropImageProps {
  onChange: (images: { url: string }[]) => void;
  isOpen: boolean;
  onClose: () => void;
  cropIndex: number | null;
  src: string;
  setImages: React.Dispatch<
    React.SetStateAction<
      {
        url: string;
      }[]
    >
  >;
}
const CropImageModal: React.FC<CropImageProps> = ({
  onChange,
  onClose,
  isOpen,
  cropIndex,
  setImages,
  src,
}) => {
  return (
    <Modal
      title="Edit image"
      description="Edit Image"
      isOpen={isOpen}
      onClose={onClose}
      classname="max-w-md overflow-y-auto"
    >
      <MultiImageCropper
        onChange={onChange}
        src={src}
        cropIndex={cropIndex}
        setImages={setImages}
        onClose={onClose}
      />
    </Modal>
  );
};

export default CropImageModal;
