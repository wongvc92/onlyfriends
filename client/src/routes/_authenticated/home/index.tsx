import { createFileRoute } from "@tanstack/react-router";
import PostForm from "./-components/post-form";
import PostCard from "./-components/post-list";

export const Route = createFileRoute("/_authenticated/home/")({
  component: () => (
    <section className="w-full">
      <div className="w-full">
        <PostForm />
      </div>
      <PostCard />
    </section>
  ),
});
