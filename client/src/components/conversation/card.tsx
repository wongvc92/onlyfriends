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

interface CardProps {
  conversation: Iconversation;
}
const Card: React.FC<CardProps> = ({ conversation }) => {
  const auth = useAuth();
  const { username } = useSearch({ strict: false });
  const [openMessageSheet, setOpenMessageSheet] = useState(false);

  const handleClick = () => {
    if (window.matchMedia("(max-width: 768px)").matches) {
      setOpenMessageSheet(true);
    }
  };
  return (
    <>
      <MessageSheet
        openMessageSheet={openMessageSheet}
        onClose={() => setOpenMessageSheet(false)}
      />
      <Link
        onClick={handleClick}
        to={`/messages/conversations/${conversation.id}`}
        search={{
          username:
            auth.user?.id === conversation.sender_id
              ? conversation.recipient_username
              : conversation.sender_username,
        }}
        key={conversation.id}
        className={`hover:bg-muted p-2 flex items-center gap-21 ${
          (auth.user?.id === conversation.sender_id
            ? conversation.recipient_username
            : conversation.sender_username) === username && "bg-muted"
        }`}
      >
        <ProfileImage
          image={
            auth.user?.id === conversation.sender_id
              ? (conversation.recipient_image as string)
              : (conversation.sender_image as string)
          }
          username={
            auth.user?.id === conversation.sender_id
              ? conversation.recipient_username
              : conversation.sender_username
          }
        />
        <div>
          <div className="flex items-center gap-2">
            <ProfileName
              name={
                auth.user?.id === conversation.sender_id
                  ? (conversation.recipient_name as string)
                  : (conversation.sender_name as string)
              }
            />
            <ProfileUsername
              username={
                auth.user?.id === conversation.sender_id
                  ? conversation.recipient_username
                  : conversation.sender_username
              }
            />
            <DotFilledIcon />
            <p className="font-light text-xs">
              {format(conversation.created_at, "dd/mm/yy")}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              {conversation.latest_message_text}
            </p>
          </div>
        </div>
      </Link>
    </>
  );
};

export default Card;
