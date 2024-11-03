import { createFileRoute } from "@tanstack/react-router";
import PostList from "./-components/post-list";

export const Route = createFileRoute("/_authenticated/$username/_layout/posts/")({
  component: PostList,
});
