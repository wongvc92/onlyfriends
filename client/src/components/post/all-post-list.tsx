import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { getAllPosts } from "@/data/getAllPosts";
import PostCard from "@/components/post/post-card";
import Spinner from "@/components/ui/spinner";

const AllPostList = () => {
  const { ref, inView } = useInView();
  const {
    status,
    data,
    error,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["allPosts"],
    queryFn: getAllPosts,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  if (status === "pending") return <Spinner />;

  if (status === "error")
    return <h1>{`An error has occurred: " + ${error.message}`}</h1>;

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
        <button
          ref={ref}
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage
            ? "Loading more..."
            : hasNextPage
              ? "Load Newer"
              : "Nothing more to load"}
        </button>
      </div>
    </div>
  );
};

export default AllPostList;
