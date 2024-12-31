import MessageForm from "@/components/message/add-form";
import MessageList from "@/components/message/message-list";
import MessageProfile from "@/components/message/message-profile";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/messages/_layout/conversations/_layout/$conversationId/")({
  component: () => (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-background">
      {/* Profile at the top */}
      <MessageProfile />

      {/* Scrollable message list */}
      <div className="flex-1 overflow-y-auto">
        <MessageList />
      </div>

      {/* Message form at the bottom */}
      <div className="sticky bottom-0 bg-white dark:bg-background p-4">
        <MessageForm />
      </div>
    </div>
  ),
});
