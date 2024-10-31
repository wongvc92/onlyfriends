import { useAuth } from "@/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchPostsByUserId } from "@/data/postsByUserId";
import { useInfiniteQuery } from "@tanstack/react-query";
import { formatDistanceToNowStrict } from "date-fns";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { FaRegHeart } from "react-icons/fa";
import { PiShareFatBold } from "react-icons/pi";
import { CiMenuKebab } from "react-icons/ci";
import { FaRegComment } from "react-icons/fa";
import PostACtion from "./post-action";

const PostCard = () => {
  const { user } = useAuth();

  const { ref, inView } = useInView();
  const { status, data, error, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: fetchPostsByUserId,
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
                  <CardTitle className="text-muted-foreground">@{user?.username}</CardTitle>
                  <CardDescription>{getrelativeTime(post.created_at)}</CardDescription>
                  <CiMenuKebab />
                </div>
              </CardHeader>

              <CardContent>{post.post}</CardContent>
              <CardFooter className="flex items-center justify-start gap-10">
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
