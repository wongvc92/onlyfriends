import { Sheet, SheetContent } from "@/components/ui/sheet";
import MessageProfile from "./message-profile";
import MessageList from "./message-list";
import MessageForm from "./add-form";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";

interface MessageSheetProps {
  openMessageSheet: boolean;
  onClose: () => void;
}
const MessageSheet: React.FC<MessageSheetProps> = ({
  openMessageSheet,
  onClose,
}) => {
  return (
    <Sheet open={openMessageSheet} onOpenChange={onClose}>
      <SheetContent className="w-full p-0">
        <div className="flex flex-col h-full">
          <div className="flex items-center pl-2">
            <Button
              type="button"
              className="bg-gray-500 rounded-full w-10 h-10"
              onClick={onClose}
            >
              <ArrowLeftIcon />
            </Button>
            <MessageProfile />
          </div>
          {/* Scrollable message list */}
          <div className="flex-1 overflow-y-auto">
            <MessageList />
          </div>

          {/* Message form at the bottom */}
          <div className="bg-white p-4">
            <MessageForm />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MessageSheet;
