import { createFileRoute } from "@tanstack/react-router";
import PersonalPostList from "@/components/post/personal-post-list";

export const Route = createFileRoute("/_authenticated/$username/_layout/posts/")({
  component: PersonalPostList,
});
