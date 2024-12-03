import { useSocketContext } from "@/context/socket";
import { Button } from "../ui/button";
import { useParams, useSearch } from "@tanstack/react-router";
import { useAuth } from "@/context/auth";
import { IoSend } from "react-icons/io5";
import DynamicTextarea from "../ui/dynamic-textarea";
import { useGetProfile } from "@/hooks/profile/useGetProfile";
import { useCreateMessage } from "@/hooks/message/useCreateMessage";

const AddForm = () => {
  const socket = useSocketContext();
  const { conversationId } = useParams({ strict: false });
  const auth = useAuth();
  const { username } = useSearch({ strict: false });
  const { data: profile } = useGetProfile(username);
  const { mutate } = useCreateMessage();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const text = formData.get("text") as string;

    if (!auth.user?.id || !profile?.user_id || !conversationId) return;
    const newMessage = {
      text,
      sender_id: auth.user.id,
      recipient_id: profile.user_id,
      conversationId,
    };
    mutate(newMessage);
    if (socket && text.trim()) {
      socket.emit("send_message", newMessage);
      e.currentTarget.reset();
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="relative">
        <DynamicTextarea name="text" id="text" className="pr-20" />
        <Button type="submit" className="absolute right-1 bottom-1">
          <IoSend />
        </Button>
      </div>
    </form>
  );
};

export default AddForm;
