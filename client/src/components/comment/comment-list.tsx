import { getCommentsByPostId } from "@/data/getCommentsByPostId";
import { IPost } from "@/types/IPost";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import CommentCard from "./comment-card";

const CommentList = ({ post }: { post: IPost }) => {
  const { ref, inView } = useInView();
  const { status, data, error, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: [`comments-${post.id!}`],
    queryFn: ({ pageParam }) => getCommentsByPostId({ pageParam, postId: post.id }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  return (
    <div className="flex flex-col gap-2">
      {data?.pages.map((page, pageIndex) => (
        <React.Fragment key={pageIndex}>
          {page.data.map((comment) => (
            <div key={comment.id} className="flex start gap-2 py-2 md:w-[800px]">
              <CommentCard comment={comment} key={comment.id} />
            </div>
          ))}
        </React.Fragment>
      ))}
      <div>
        <button ref={ref} onClick={() => fetchNextPage()} disabled={!hasNextPage || isFetchingNextPage}>
          {isFetchingNextPage ? "Loading more..." : hasNextPage ? "Load Newer" : "Nothing more to load"}
        </button>
      </div>
    </div>
  );
};

export default CommentList;
