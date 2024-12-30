import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ModalProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  classname?: string;
  closeButtonColor?: string;
}

const Modal: React.FC<ModalProps> = ({ title, description, isOpen, children, onClose, classname, closeButtonColor = "text-black" }) => {
  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent className={cn("max-h-[100vh] max-w-[100vw] rounded-md", classname)} closeButtonColor={closeButtonColor}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};
export default Modal;
