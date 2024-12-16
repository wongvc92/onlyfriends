import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/messages/_layout/conversations/")({
  component: () => <div className="flex justify-center items-center h-full">Please select a message.</div>,
});
