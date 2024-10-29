import { createFileRoute, createRouter, redirect, RootRoute } from "@tanstack/react-router";
import PostForm from "./-components/post-form";
import { checkIfAuthenticated, useAuth } from "@/auth";
import { postsQueryOptions } from "@/data/postsByUserId";
import { useSuspenseQuery } from "@tanstack/react-query";
import PostCard from "./-components/post-card";

export const Route = createFileRoute("/_authenticated/posts/")({

  loader: async ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(postsQueryOptions);
  },
  component: Page,
});

function Page() {
  const { data } = useSuspenseQuery(postsQueryOptions);
  console.log("postsQuery data", data);
  return (
    <section className="w-full">
      <div className="w-full">
        <PostForm />
      </div>
      <PostCard />
    </section>
  );
}
