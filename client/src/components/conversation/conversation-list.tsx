import { useGetConversations } from "@/hooks/conversation/useGetConversations";
import Card from "./conversation-card";
import Spinner from "../ui/spinner";

const ConversationList = () => {
  const { data: conversations, isLoading, error } = useGetConversations();

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div className="text-center">Something went wrong please try again.</div>;
  }

  if (!conversations || conversations.length === 0) {
    return <div className="text-center">No message found.</div>;
  }
  return (
    <div>
      {conversations.map((conversation) => (
        <Card conversation={conversation} key={conversation.id}></Card>
      ))}
    </div>
  );
};

export default ConversationList;
