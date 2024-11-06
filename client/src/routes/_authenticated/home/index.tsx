import { createFileRoute } from "@tanstack/react-router";
import PostForm from "@/components/post/post-form";
import AllPostList from "@/components/post/all-post-list";

export const Route = createFileRoute("/_authenticated/home/")({
  component: () => (
    <section className="w-full">
      <div className="w-full">
        <PostForm />
      </div>
      <AllPostList />
    </section>
  ),
});
