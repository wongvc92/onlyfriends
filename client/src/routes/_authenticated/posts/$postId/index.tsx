import PostPage from "@/components/post/post-page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/posts/$postId/")({
  component: PostPage,
});
