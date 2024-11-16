import { createFileRoute } from "@tanstack/react-router";
import PostForm from "@/components/post/post-form";
import AllPostList from "@/components/post/all-post-list";
import { useState } from "react";
import PostModal from "@/components/post/post-modal";
import { ImageIcon } from "@radix-ui/react-icons";

export const Route = createFileRoute("/_authenticated/home/")({
  component: HomePage,
});

function HomePage() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <section>
      <div
        className="flex items-center justify-between border rounded-md p-4 text-muted-foreground mx-4"
        onClick={() => setIsOpen(true)}
      >
        what's on your mind... <ImageIcon />
      </div>

      <PostModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <AllPostList />
    </section>
  );
}
