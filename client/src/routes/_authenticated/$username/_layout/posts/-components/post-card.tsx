import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getPostsByUsername } from "@/data/getPostsByUsername";
import { useInfiniteQuery } from "@tanstack/react-query";
import { formatDistanceToNowStrict } from "date-fns";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { FaRegHeart } from "react-icons/fa";
import { PiShareFatBold } from "react-icons/pi";
import { FaRegComment } from "react-icons/fa";
import PostACtion from "./post-action";
import { DotFilledIcon } from "@radix-ui/react-icons";
import { useParams } from "@tanstack/react-router";

const PostCard = () => {
  const { username } = useParams({ strict: false });

  const { ref, inView } = useInView();
  const { status, data, error, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: ({ pageParam }) => getPostsByUsername({ pageParam, username: username as string }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  const getrelativeTime = (date: Date) => {
    const relativeTime = formatDistanceToNowStrict(new Date(date), {
      addSuffix: true,
      roundingMethod: "floor",
    })
      .replace("minutes", "m")
      .replace("minute", "m")
      .replace("hours", "h")
      .replace("hour", "h")
      .replace("days", "d")
      .replace("day", "d")
      .replace("weeks", "w")
      .replace("week", "w")
      .replace("months", "mo")
      .replace("month", "mo")
      .replace("years", "y")
      .replace("year", "y");
    return relativeTime;
  };

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
            <Card key={post.id}>
              <CardHeader>
                <div className="flex gap-1 items-start">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <CardTitle>
                    <div className="flex flex-wrap items-center gap-1">
                      <p className="line-clamp-2">{post.name}</p>
                      <p className="text-muted-foreground font-light">@{post.username}</p>
                      <DotFilledIcon />
                      <p className="text-muted-foreground font-light">{getrelativeTime(post.created_at)}</p>
                    </div>
                  </CardTitle>
                  <div className="ml-auto">
                    <PostACtion post={post} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>{post.post}</CardContent>
              <CardFooter className="flex items-center justify-between md:justify-start md:gap-10">
                <FaRegComment />
                <FaRegHeart />
                <PiShareFatBold />
              </CardFooter>
            </Card>
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

export default PostCard;
