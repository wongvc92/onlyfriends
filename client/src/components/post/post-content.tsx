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
      const lineHeight = parseFloat(getComputedStyle(postRef.current).lineHeight);
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

  const renderCommentWithMentions = (text: string) => {
    // Regular expression to detect words that start with "@"
    const parts = text.split(/(@\w+)/g);

    return parts.map((part, index) => {
      if (part.startsWith("@")) {
        // Style the mention with blue color
        return (
          <Link key={index} className="text-sky-600" to={`/$username`} params={{ username: part.slice(1, part.length) }}>
            {part}
          </Link>
        );
      }
      return part; // Regular text remains unstyled
    });
  };
  return (
    <div onClick={() => setSeeMore(!seeMore)} className="w-full ">
      <div className="md:w-[500px] xl:w-[600px] 2xl:w-[800px]">
        <p className={cn("mb-2 break-words overflow-hidden", !seeMore && isClamped ? "line-clamp-2" : "")} ref={postRef}>
          {renderCommentWithMentions(post.post)}
        </p>
      </div>
      {isClamped && (
        <Button variant="link" className="text-sky-500 p-0">
          {seeMore ? "" : "See more"}
        </Button>
      )}

      <ImageSlider post={post} />
    </div>
  );
};

export default PostContent;
