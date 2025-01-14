import React from "react";
import Modal from "../ui/modal";
import PostForm from "./add-post-form";

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const PostModal: React.FC<PostModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} classname="max-w-2xl top-56 sm:top-96 overflow-y-scroll">
      <PostForm onClose={onClose} />
    </Modal>
  );
};

export default PostModal;
