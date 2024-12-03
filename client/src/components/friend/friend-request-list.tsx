import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import ApproveFriendButton from "./approve-friend-button";
import Spinner from "../ui/spinner";
import { Button } from "../ui/button";
import ProfileImage from "../profile/profile-image";
import ProfileName from "../profile/profile-name";
import ProfileUsername from "../profile/profile-username";
import { getFriendsRequest } from "@/data/getFriendsRequests";
import { Link, useLocation } from "@tanstack/react-router";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const FriendRequestList = () => {
  const { ref, inView } = useInView();
  const pathname = useLocation({
    select: (location) => location.pathname,
  });
  const {
    status,
    data,
    error,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isPending,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["friends-pending"],
    queryFn: getFriendsRequest,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <div>Something went wrong please try again.</div>;
  }

  if (data?.pages[0].data.length === 0) {
    return (
      <div className="flex items-center gap-2">
        <p className="text-xs">No friend request at the moment.</p>
        <Link to="/friends/find">
          <Button
            type="button"
            variant="secondary"
            className="rounded-full flex justify-center items-center gap-2 text-xs"
          >
            <MagnifyingGlassIcon />
            Find friends
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="border rounded-md p-2 space-y-4 ">
      <div className="space-y-4">
        {data?.pages.map((page, pageIndex) => (
          <React.Fragment key={pageIndex}>
            {page.data.map((friendRequest) => (
              <div
                key={friendRequest.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-start gap-2">
                  <ProfileImage
                    image="https://github.com/shadcn.png"
                    username={friendRequest.username}
                    classname="w-10 h-10"
                  />
                  <div>
                    <ProfileName
                      name={friendRequest.name}
                      classname="font-bold text-sm"
                    />
                    <ProfileUsername
                      username={friendRequest.username}
                      classname="font-light text-muted-foreground text-xs"
                    />
                  </div>
                </div>
                <ApproveFriendButton friendRequestId={friendRequest.id} />
              </div>
            ))}
          </React.Fragment>
        ))}
        <button
          ref={ref}
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage
            ? "Loading more..."
            : hasNextPage
              ? "Load Newer"
              : ""}
        </button>
      </div>
      <Link
        to="/friends/find"
        className={`${data?.pages[0].data?.length === 0 ? "hidden" : pathname === "/friends/friend-request" ? "hidden" : "block"}`}
      >
        <Button
          type="button"
          variant="link"
          className="text-blue-500"
          size="sm"
        >
          Show more
        </Button>
      </Link>
    </div>
  );
};

export default FriendRequestList;
