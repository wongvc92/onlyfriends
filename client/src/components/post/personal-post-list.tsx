import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import PostCard from "@/components/post/post-card";
import { useGetPostsByUsername } from "@/hooks/post/useGetPostsByUsername";

const PersonalPostList = () => {
  const { ref, inView } = useInView();
  const { status, data, error, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } = useGetPostsByUsername();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  if (status === "pending") return <h1>Loading...</h1>;

  if (status === "error") return <h1>{`An error has occurred: " + ${error.message}`}</h1>;

  return (
    <div className="flex flex-col gap-2">
      <div>{isFetching && !isFetchingNextPage ? "updating..." : null}</div>
      {data.pages.map((page, pageIndex) => (
        <React.Fragment key={pageIndex}>
          {page.data.map((post) => (
            <PostCard post={post} key={post.id} />
          ))}
        </React.Fragment>
      ))}
      <div className="text-xs flex justify-center text-muted-foreground">
        <button ref={ref} onClick={() => fetchNextPage()} disabled={!hasNextPage || isFetchingNextPage}>
          {isFetchingNextPage ? "Loading more..." : hasNextPage ? "Load Newer" : "Nothing more to load"}
        </button>
      </div>
    </div>
  );
};

export default PersonalPostList;
