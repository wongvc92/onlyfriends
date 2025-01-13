import Modal from "../ui/modal";
import { IPost } from "@/types/IPost";
import PostComment from "./post-comment";
import { Button } from "../ui/button";

interface CommentModalProps {
  isOpen: boolean;
  closeModal: () => void;
  post: IPost;
}

const AddCommentModal: React.FC<CommentModalProps> = ({ isOpen, closeModal, post }) => {
  return (
    <Modal isOpen={isOpen} onClose={closeModal} classname="max-w-xl top-36">
      <div className="flex justify-center items-center">
        <PostComment post={post} closeModal={closeModal} />
      </div>
      <Button type="button" variant="destructive" className="w-fit" onClick={closeModal}>
        Cancel
      </Button>
    </Modal>
  );
};

export default AddCommentModal;
