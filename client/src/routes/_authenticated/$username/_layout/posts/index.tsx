import { createFileRoute } from "@tanstack/react-router";
import PostCard from "./-components/post-card";

export const Route = createFileRoute("/_authenticated/$username/_layout/posts/")({
  component: PostCard,
});
