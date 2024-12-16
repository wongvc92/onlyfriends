import Spinner from "../ui/spinner";
import ProfileImage from "../profile/profile-image";
import ProfileName from "../profile/profile-name";
import ProfileUsername from "../profile/profile-username";
import UnfriendButton from "./unfriend-button";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Button } from "../ui/button";
import { Link } from "@tanstack/react-router";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useGetAcceptedFriends } from "@/hooks/friend/useGetAcceptedFriends";

const AcceptedList = () => {
  const { ref, inView } = useInView();
  const { data, error, isFetchingNextPage, fetchNextPage, hasNextPage, isLoading } = useGetAcceptedFriends();

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
        <p className="text-xs px-2">No friends at the moment.</p>

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
        <div className="space-y-4 ">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 ">
            {data.pages.map((page, pageIndex) => (
              <React.Fragment key={pageIndex}>
                {page.data.map((acceptedFriend) => (
                  <div key={acceptedFriend.id} className="flex  w-full items-center justify-between border p-4 rounded-md">
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
          <button
            ref={ref}
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}
            className="text-xs text-center w-full text-muted-foreground"
          >
            {isFetchingNextPage ? "Loading more..." : hasNextPage ? "Load Newer" : "Nothing more to load"}
          </button>
        </div>
      )}
    </>
  );
};

export default AcceptedList;
