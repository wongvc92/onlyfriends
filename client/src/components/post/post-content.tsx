import { IPost } from "@/types/IPost";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import ImageSlider from "../image/image-slider";
import { Link, useLocation } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

interface PostContentProps {
  post: IPost;
}
const PostContent: React.FC<PostContentProps> = ({ post }) => {
  const [seeMore, setSeeMore] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const postRef = useRef<HTMLParagraphElement | null>(null);
  const pathname = useLocation({
    select: (location) => location.pathname,
  });

  useEffect(() => {
    if (postRef.current) {
      const lineHeight = parseFloat(
        getComputedStyle(postRef.current).lineHeight
      );
      const maxHeight = lineHeight * 2;
      if (postRef.current.scrollHeight > maxHeight) {
        if (pathname === `/posts/${post.id}`) {
          setIsClamped(false);
        } else {
          setIsClamped(true);
        }
      }
    }
  }, [post.post, pathname, post.id]);

  return (
    <div onClick={() => setSeeMore(!seeMore)}>
      <p
        className={cn("mb-2", !seeMore && isClamped ? "line-clamp-2" : "")}
        ref={postRef}
      >
        {post.post}
      </p>

      {isClamped && (
        <Button variant="link" className="text-sky-500 p-0 self-">
          {seeMore ? "" : "See more"}
        </Button>
      )}

      <ImageSlider post={post} />
    </div>
  );
};

export default PostContent;
