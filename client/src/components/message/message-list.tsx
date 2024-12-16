import { useAuth } from "@/context/auth";
import { IMessage } from "@/types/IMessage";
import { useEffect, useRef } from "react";
import ProfileImage from "../profile/profile-image";
import { getRouteApi, useParams } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import Spinner from "../ui/spinner";
import { format } from "date-fns";
import { useGetMessages } from "@/hooks/message/useGetMessages";
import { ConversationsSchema } from "@/routes/_authenticated/messages";
import { cn } from "@/lib/utils";
import { messageKeys } from "@/hooks/message/messageKeys";
import { useSocket } from "@/context/socket";

const MessageList = () => {
  const { socket } = useSocket();
  const auth = useAuth();
  const { conversationId } = useParams({ from: "/_authenticated/messages/_layout/conversations/_layout/$conversationId/" });
  const queryClient = useQueryClient();
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const messageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const { data: messages, isLoading, error } = useGetMessages(conversationId);
  const routeApi = getRouteApi("/_authenticated/messages");
  const routeSearch = routeApi.useSearch();
  const { query } = routeSearch as ConversationsSchema;
  const searchText = query ? query.toLowerCase() : "";

  const scrollToMessage = (id?: string) => {
    if (id && messageRefs.current[id]) {
      messageRefs.current[id]?.scrollIntoView({ behavior: "smooth" });
    } else {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Scroll to the latest message
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    socket?.on("newMessage", (newMessage: IMessage) => {
      console.log("newMessage", newMessage);
      queryClient.setQueryData(messageKeys.list(conversationId), (oldData: IMessage[] | undefined) => {
        return oldData ? [...oldData, newMessage] : [newMessage];
      });
      scrollToBottom();
    });

    return () => {
      socket?.off("newMessage");
    };
  }, [socket, queryClient, conversationId]);

  useEffect(() => {
    if (query) {
      const matchingMessage = messages?.reverse().find((msg) => msg?.text?.toLowerCase().includes(query.toLowerCase()));
      if (matchingMessage) {
        scrollToMessage(matchingMessage.id);
      }
    } else {
      scrollToBottom();
    }
  }, [query, messages]);

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <div>Something went wrong please try again.</div>;
  }
  if (!messages || messages.length === 0) {
    return <div>Start new chat</div>;
  }

  return (
    <div className="flex-1 p-4 space-y-4">
      {messages.map((message) => {
        const isCurrentUserSender = auth.user?.id === message.sender_id;
        const text = message.text ?? "";
        const highlighted = query && text.toLowerCase().includes(searchText);

        return (
          <div
            key={message.id}
            ref={(el) => (messageRefs.current[message.id] = el)}
            className={cn("flex ", isCurrentUserSender ? "justify-end " : "justify-start", highlighted ? "bg-sky-200 rounded-md" : "")}
          >
            <div className={`flex items-baseline gap-2 md:max-w-md xl:max-w-xl ${isCurrentUserSender && "flex-row-reverse"}`}>
              <ProfileImage
                image={message?.sender_image || ""}
                username={message.sender_username}
                classname={`${isCurrentUserSender ? "hidden" : "block"}`}
              />
              <div className={`text-sm p-2 rounded-md ${isCurrentUserSender ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}>
                <p className="break-all">{message.text}</p>
                <div className="flex justify-end">
                  <span className={`text-[12px] font-light ${isCurrentUserSender ? " text-white" : "text-muted-foreground"}`}>
                    {format(message.created_at, "HH:mm dd/MM")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Dummy div to scroll to */}
      <div ref={messageEndRef} />
    </div>
  );
};

export default MessageList;
