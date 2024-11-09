import { useInfiniteQuery } from "@tanstack/react-query";
import Spinner from "../ui/spinner";
import ProfileImage from "../profile/profile-image";
import ProfileName from "../profile/profile-name";
import ProfileUsername from "../profile/profile-username";
import UnfriendButton from "./unfriend-button";
import { getAcceptedFriends } from "@/data/getAcceptedFriends";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Button } from "../ui/button";
import { Link, useLocation } from "@tanstack/react-router";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

const AcceptedFriendList = () => {
  const { ref, inView } = useInView();
  const { status, data, error, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage, isPending, isLoading } = useInfiniteQuery({
    queryKey: ["friends-accepted"],
    queryFn: getAcceptedFriends,
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
        <p className="text-xs">No friends at the moment.</p>

        <Link to="/friends/find">
          <Button type="button" variant="secondary" className="rounded-full flex justify-center items-center gap-2 text-xs">
            <MagnifyingGlassIcon />
            Find friends
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      {data && data.pages[0].data.length > 0 && (
        <div className="p-2 space-y-4 ">
          <div>Friends List</div>
          <div className="space-y-4">
            {data.pages.map((page, pageIndex) => (
              <React.Fragment key={pageIndex}>
                {page.data.map((acceptedFriend) => (
                  <div key={acceptedFriend.id} className="flex items-center justify-between">
                    <div className="flex items-start gap-2">
                      <ProfileImage image="https://github.com/shadcn.png" username={acceptedFriend.username} classname="w-10 h-10" />
                      <div>
                        <ProfileName name={acceptedFriend.name} classname="font-bold text-sm" />
                        <ProfileUsername username={acceptedFriend.username} classname="font-light text-muted-foreground text-xs" />
                      </div>
                    </div>
                    <UnfriendButton peopleId={acceptedFriend.user_id} />
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
          <button ref={ref} onClick={() => fetchNextPage()} disabled={!hasNextPage || isFetchingNextPage}>
            {isFetchingNextPage ? "Loading more..." : hasNextPage ? "Load Newer" : "Nothing more to load"}
          </button>
        </div>
      )}
    </>
  );
};

export default AcceptedFriendList;
