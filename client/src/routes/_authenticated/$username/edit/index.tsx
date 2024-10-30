import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/$username/edit/")({
  component: () => <div>Hello /_authenticated/$username/edit/!</div>,
});
