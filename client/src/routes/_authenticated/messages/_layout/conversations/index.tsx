import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/messages/_layout/conversations/"
)({
  component: () => (
    <div>Hello /_authenticated/messages/_layout/conversation/!</div>
  ),
});
