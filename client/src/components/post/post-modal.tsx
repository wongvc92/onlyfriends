import React from "react";
import Modal from "../ui/modal";
import PostForm from "./add-post-form";

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const PostModal: React.FC<PostModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} classname="max-w-2xl overflow-y-scroll h-auto flex px-1">
      <PostForm onClose={onClose} />
    </Modal>
  );
};

export default PostModal;
