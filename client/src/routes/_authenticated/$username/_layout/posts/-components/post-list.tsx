import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useParams } from "@tanstack/react-router";
import PostCard from "@/components/post/post-card";
import { getPostsByUsername } from "@/data/getPostsByUsername";

const PostList = () => {
  const { username } = useParams({ strict: false });
  const { ref, inView } = useInView();
  const { status, data, error, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: [`posts-${username!}`],
    queryFn: ({ pageParam }) => getPostsByUsername({ pageParam, username: username as string }),
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
            <PostCard post={post} key={post.id} />
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
