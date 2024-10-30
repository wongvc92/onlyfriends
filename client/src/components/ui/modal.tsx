import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface ModalProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  classname?: string;
}

const Modal: React.FC<ModalProps> = ({ title, description, isOpen, children, onClose, classname }) => {
  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent className={cn("max-h-[90vh] max-w-[80vw] rounded-md", classname)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <DialogFooter>{children}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default Modal;
