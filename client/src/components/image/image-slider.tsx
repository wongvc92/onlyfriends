import { IPost } from "@/types/IPost";
import React, { useRef, useState } from "react";
import ImageModal from "./image-modal";

interface ImageSliderProps {
  post: IPost;
}
const ImageSlider: React.FC<ImageSliderProps> = ({ post }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialImageIndex, setInitialImageIndex] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
    containerRef.current.style.cursor = "grabbing";
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      if (containerRef.current) containerRef.current.style.cursor = "grab";
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!containerRef.current) return;

    // If no drag occurred, open the modal
    if (startX === e.pageX - containerRef.current.offsetLeft) {
      setIsModalOpen(true);
    }

    setIsDragging(false);
    containerRef.current.style.cursor = "grab";
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();

    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Multiplier for scroll speed
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  console.log("initial image index", initialImageIndex);
  return (
    <>
      {!!post.images && post.images.length > 0 && (
        <div className="overflow-hidden">
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className="flex gap-4 overflow-x-scroll no-scrollbar cursor-grab"
            style={{ cursor: isDragging ? "grabbing" : "grab" }}
          >
            {post.images.map((image, i) => (
              <img
                src={image.url}
                key={image.id}
                className={`max-w-[300px] rounded-md object-cover transition-transform duration-300 ${
                  isDragging ? "scale-95" : "hover:scale-105"
                }`}
                style={{
                  pointerEvents: isDragging ? "none" : "auto",
                }}
                onMouseEnter={() => setInitialImageIndex(i)}
                onTouchStart={() => setInitialImageIndex(i)}
              />
            ))}
          </div>
          {/* Image Modal */}
          {isModalOpen && (
            <ImageModal
              isModalOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              post={post}
              initialImageIndex={initialImageIndex}
            />
          )}
        </div>
      )}
    </>
  );
};

export default ImageSlider;
