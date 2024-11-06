import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import AddFriendButton from "./add-friend-button";
import Spinner from "../ui/spinner";
import { Button } from "../ui/button";
import ProfileImage from "../profile/profile-image";
import ProfileName from "../profile/profile-name";
import ProfileUsername from "../profile/profile-username";
import { getPeoples } from "@/data/getPeoples";
import { Link, useLocation } from "@tanstack/react-router";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const PeoplesList = () => {
  const { ref, inView } = useInView();
  const pathname = useLocation({
    select: (location) => location.pathname,
  });

  const { status, data, error, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage, isPending, isLoading } = useInfiniteQuery({
    queryKey: ["peoples"],
    queryFn: getPeoples,
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
  return (
    <div className="space-y-4">
      {data?.pages.map((page, pageIndex) => (
        <React.Fragment key={pageIndex}>
          {page.data.map((people) => (
            <div key={people.id} className="flex items-start justify-between gap-1">
              <div className="flex items-start gap-2">
                <ProfileImage image="https://github.com/shadcn.png" username={people.username} classname="w-10 h-10" />
                <div>
                  <ProfileName name={people.name} classname="font-bold text-sm" />
                  <ProfileUsername username={people.username} classname="font-light text-muted-foreground text-xs" />
                </div>
              </div>
              <AddFriendButton peopleId={people.id} />
            </div>
          ))}
        </React.Fragment>
      ))}
      <button ref={ref} onClick={() => fetchNextPage()} disabled={!hasNextPage || isFetchingNextPage} className="text-xs">
        {isFetchingNextPage ? "Loading more..." : hasNextPage ? "Load Newer" : ""}
      </button>
      <Link to="/friends/find" className={`${data?.pages[0].data?.length === 0 ? "hidden" : pathname === "/friends/find" ? "hidden" : "block"}`}>
        <Button type="button" variant="link" className="text-blue-500" size="sm">
          Show more
        </Button>
      </Link>
    </div>
  );
};

export default PeoplesList;
