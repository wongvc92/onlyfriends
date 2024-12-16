import Modal from "../ui/modal";
import { IPost } from "@/types/IPost";

interface CommentModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  post: IPost;
  commentCount?: number;
}

const CommentModal: React.FC<CommentModalProps> = ({ isOpen, setIsOpen, post, commentCount }) => {
  return <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} classname="h-[90vh] overflow-y-scroll"></Modal>;
};

export default CommentModal;
