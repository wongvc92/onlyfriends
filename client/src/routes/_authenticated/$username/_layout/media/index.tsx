import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/$username/_layout/media/")({
  component: () => <div>Hello /_authenticated/$username/_layout/media/!</div>,
});
