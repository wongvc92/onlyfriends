import { IPost } from "@/types/IPost";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import CommentCard from "./comment-card";
import Spinner from "../ui/spinner";
import { Button } from "../ui/button";
import { useGetAllComments } from "@/hooks/comment/useGetAllComments";

const CommentList = ({ post }: { post: IPost }) => {
  const { ref, inView } = useInView();
  const { status, data, error, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } = useGetAllComments({ postId: post.id });

  // Trigger fetching new comments when the button comes into view
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  return (
    <div className="flex flex-col gap-2 p-4">
      {data?.pages[0]?.data.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center">No comment yet. Be the first to comment.</p>
      ) : (
        data?.pages.map((page, pageIndex) => (
          <React.Fragment key={pageIndex}>
            {page.data.map((comment) => (
              <div key={comment.id} className="flex start gap-2 py-2">
                <CommentCard comment={comment} />
              </div>
            ))}
          </React.Fragment>
        ))
      )}
      <div className="text-xs flex justify-center text-muted-foreground">
        <Button
          ref={ref}
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
          variant="link"
          className="text-muted-foreground text-xs"
        >
          {isFetchingNextPage ? <Spinner size="4" /> : hasNextPage ? <span className="underline">Load more</span> : "Nothing more to load"}
        </Button>
      </div>
    </div>
  );
};

export default CommentList;
