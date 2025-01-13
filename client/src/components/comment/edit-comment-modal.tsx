import Modal from "../ui/modal";
import { Button } from "../ui/button";
import EditComment from "./edit-comment";
import { IComment } from "@/types/IComment";

interface CommentModalProps {
  isOpen: boolean;
  closeEditModal: () => void;
  comment: IComment;
}

const EditCommentModal: React.FC<CommentModalProps> = ({ isOpen, closeEditModal, comment }) => {
  return (
    <Modal isOpen={isOpen} onClose={closeEditModal} classname="max-w-xl top-36">
      <div className="flex justify-center items-center">
        <EditComment comment={comment} closeEditModal={closeEditModal} />
      </div>
      <Button type="button" variant="destructive" className="w-fit" onClick={closeEditModal}>
        Cancel
      </Button>
    </Modal>
  );
};

export default EditCommentModal;
