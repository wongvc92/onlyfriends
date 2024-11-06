import { getSentFriendRequests } from "@/data/getSentFriendRequests";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import Spinner from "../ui/spinner";
import { useInView } from "react-intersection-observer";
import ProfileImage from "../profile/profile-image";
import ProfileName from "../profile/profile-name";
import ProfileUsername from "../profile/profile-username";
import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import CancelAddFriendButton from "./cancel-add-friend-button";

const PendingSetRequest = () => {
  const { ref, inView } = useInView();

  const { status, data, error, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage, isPending, isLoading } = useInfiniteQuery({
    queryKey: ["friends-sentRequest"],
    queryFn: getSentFriendRequests,
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
        <p className="text-xs"> No pending request at the moment.</p>

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
                {page.data.map((pendingRequest) => (
                  <div key={pendingRequest.id} className="flex items-center justify-between">
                    <div className="flex items-start gap-2">
                      <ProfileImage image="https://github.com/shadcn.png" username={pendingRequest.username} classname="w-10 h-10" />
                      <div>
                        <ProfileName name={pendingRequest.name} classname="font-bold text-sm" />
                        <ProfileUsername username={pendingRequest.username} classname="font-light text-muted-foreground text-xs" />
                      </div>
                    </div>
                    <CancelAddFriendButton peopleId={pendingRequest.user_id} />
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
          <button ref={ref} onClick={() => fetchNextPage()} disabled={!hasNextPage || isFetchingNextPage}>
            {isFetchingNextPage ? "Loading more..." : hasNextPage ? "Load Newer" : ""}
          </button>
        </div>
      )}
    </>
  );
};

export default PendingSetRequest;
