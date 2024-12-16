import ProfileImage from "@/components/profile/profile-image";
import ProfileName from "@/components/profile/profile-name";
import ProfileUsername from "@/components/profile/profile-username";
import { DotFilledIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { Link, useSearch } from "@tanstack/react-router";
import { useAuth } from "@/context/auth";
import { Iconversation } from "@/types/IConversation";
import MessageSheet from "../message/message-sheet";
import { useState } from "react";
import { useSocket } from "@/context/socket";

interface CardProps {
  conversation: Iconversation;
}
const ConversationCard: React.FC<CardProps> = ({ conversation }) => {
  const auth = useAuth();
  const { username } = useSearch({ strict: false });
  const [openMessageSheet, setOpenMessageSheet] = useState(false);
  const { onlineUsers } = useSocket();

  const otherUserId = auth.user?.id === conversation.sender_id ? conversation.recipient_id : conversation.sender_id;
  const searchUsername = auth.user?.id === conversation.sender_id ? conversation.recipient_username : conversation.sender_username;
  const profileImage = auth.user?.id === conversation.sender_id ? (conversation.recipient_image as string) : (conversation.sender_image as string);
  const profileUsername = auth.user?.id === conversation.sender_id ? conversation.recipient_username : conversation.sender_username;
  const profileName = auth.user?.id === conversation.sender_id ? (conversation.recipient_name as string) : (conversation.sender_name as string);
  const activeCard =
    (auth.user?.id === conversation.sender_id ? conversation.recipient_username : conversation.sender_username) === username && "bg-gray-50";

  const isOnline = onlineUsers.includes(otherUserId);

  const handleClick = () => {
    if (window.matchMedia("(max-width: 768px)").matches) {
      setOpenMessageSheet(true);
    }
  };
  return (
    <>
      <MessageSheet openMessageSheet={openMessageSheet} onClose={() => setOpenMessageSheet(false)} />
      <Link
        onClick={handleClick}
        to={`/messages/conversations/${conversation.id}`}
        search={{
          username: searchUsername,
        }}
        key={conversation.id}
      >
        <div className={`flex items-center gap-2 p-2 hover:bg-muted  ${activeCard}`}>
          <div className="relative">
            <ProfileImage image={profileImage} username={profileUsername} />
            <div className={`p-1 rounded-full absolute top-0 right-0 ${isOnline ? "bg-emerald-500" : "bg-none"}`}></div>
          </div>

          <div className="flex flex-col justify-center w-full">
            <div className="flex flex-wrap items-center">
              <ProfileName name={profileName} />
              <ProfileUsername username={profileUsername} />
            </div>
            <div className="flex justify-between items-center pt-2">
              <p className="text-sm text-muted-foreground">{conversation.latest_message_text}</p>
              <p className="font-light text-xs">{format(conversation.created_at, "dd/MM/yy")}</p>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};

export default ConversationCard;
