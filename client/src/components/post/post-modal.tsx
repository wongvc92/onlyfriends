import React from "react";
import Modal from "../ui/modal";
import PostForm from "./add-post-form";

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const PostModal: React.FC<PostModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      classname="overflow-y-scroll max-w-2xl"
    >
      <PostForm onClose={onClose} />
    </Modal>
  );
};

export default PostModal;
