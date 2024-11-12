import React, { useState } from "react";
import { FaRegComment } from "react-icons/fa";
import { Button } from "../ui/button";

import { IPost } from "@/types/IPost";

import { useQuery } from "@tanstack/react-query";
import { getCommentCountByPostId } from "@/data/getCommentCountByPostId";
import CommentModal from "./comment-modal";

const Comments = ({ post }: { post: IPost }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading, error } = useQuery({
    queryKey: ["commentsCount", post.id],
    queryFn: () => getCommentCountByPostId(post.id),
  });

  return (
    <>
      <CommentModal
        post={post}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        commentCount={data?.count}
      />

      <div className="flex items-center">
        <Button
          type="button"
          size="icon"
          variant="link"
          onClick={() => setIsOpen(!isOpen)}
        >
          <FaRegComment />
          <span className="text-xs text-muted-foreground">
            {data?.count || 0}
          </span>
        </Button>
      </div>
    </>
  );
};

export default Comments;
