import { useAuth } from "@/auth";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { getAllPosts } from "@/data/getAllPosts";
import PostCard from "@/components/post-card";

const PostList = () => {
  const { user } = useAuth();
  console.log("useAuth", user);
  const { ref, inView } = useInView();
  const { status, data, error, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteQuery({
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

  if (status === "pending") return <h1>Loading...</h1>;

  if (status === "error") return <h1>{`An error has occurred: " + ${error.message}`}</h1>;

  console.log("data", data.pages[0]);
  return (
    <div className="flex flex-col gap-2">
      <div>{isFetching && !isFetchingNextPage ? "updating..." : null}</div>
      {data.pages.map((page, pageIndex) => (
        <React.Fragment key={pageIndex}>
          {page.data.map((post) => (
            <PostCard post={post} />
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

export default PostList;
