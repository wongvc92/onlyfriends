import Modal from "../ui/modal";
import { IPost } from "@/types/IPost";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

interface ImageModalProps {
  isModalOpen: boolean;
  onClose: () => void;
  post: IPost;
  initialImageIndex: number;
}
const ImageModal: React.FC<ImageModalProps> = ({ isModalOpen, onClose, post, initialImageIndex }) => {
  return (
    <Modal
      isOpen={isModalOpen}
      onClose={onClose}
      classname="h-[100vh] bg-black border-none flex items-center justify-center"
      closeButtonColor="text-white"
    >
      <div>
        <Carousel opts={{ startIndex: initialImageIndex }}>
          <CarouselContent>
            {post.images &&
              post.images.length > 0 &&
              post.images.map((image, index) => (
                <CarouselItem key={index} className="flex items-center justify-center">
                  <Card className="bg-black border-none">
                    <CardContent>
                      <img src={image.url} key={image.id} alt={`post image ${index + 1}`} className="w-full max-h-[80vh] object-contain" />
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
          </CarouselContent>
          <CarouselPrevious
            className={`ml-10 hidden md:block text-white ${post.images && post.images.length === 1 && "md:hidden"}`}
            variant="link"
            size="lg"
          />
          <CarouselNext
            className={`mr-10 hidden md:block text-white ${post.images && post.images.length === 1 && "md:hidden"}`}
            variant="link"
            size="lg"
          />
        </Carousel>
      </div>
    </Modal>
  );
};

export default ImageModal;
