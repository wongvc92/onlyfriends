import AddFriendButton from "../friend/add-friend-button";
import Spinner from "../ui/spinner";
import { Button } from "../ui/button";
import ProfileImage from "../profile/profile-image";
import ProfileName from "../profile/profile-name";
import ProfileUsername from "../profile/profile-username";
import { Link, useLocation } from "@tanstack/react-router";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useGetPeoples } from "@/hooks/people/useGetpeoples";

const PeoplesList = () => {
  const { ref, inView } = useInView();

  const { data, error, isFetchingNextPage, fetchNextPage, hasNextPage, isLoading } = useGetPeoples();

  const pathname = useLocation({
    select: (location) => location.pathname,
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

  if (!data) {
    return <div>No data yet.</div>;
  }

  return (
    <div className={`px-2 grid gap-4 ${pathname !== "/friends/find" ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"}`}>
      {/* Check if all pages are empty */}
      {data.pages.every((page) => page.data.length === 0) ? (
        <p className="text-xs">No friends at the moment</p>
      ) : (
        data.pages.map((page, pageIndex) => (
          <React.Fragment key={pageIndex}>
            {page.data.map((people) => (
              <div key={people.id} className={`flex items-start justify-between ${pathname === "/friends/find" && "gap-4 border rounded-md p-4"}`}>
                <div className="flex items-center gap-2">
                  <ProfileImage image={people.display_image || ""} username={people.username} classname="w-10 h-10" />
                  <div>
                    <ProfileName name={people.name || ""} classname="font-bold text-sm" />
                    <ProfileUsername username={people.username} classname="font-light text-muted-foreground text-xs" />
                  </div>
                </div>
                <AddFriendButton peopleId={people.id} />
              </div>
            ))}
          </React.Fragment>
        ))
      )}
      <button ref={ref} onClick={() => fetchNextPage()} disabled={!hasNextPage || isFetchingNextPage} className="text-xs">
        {isFetchingNextPage ? "Loading more..." : hasNextPage ? "Load Newer" : ""}
      </button>
      <Link to="/friends/find" className={`${pathname === "/friends/find" || data.pages[0].data.length === 0 ? "hidden" : "block"}`}>
        <Button type="button" variant="link" className="text-blue-500" size="sm">
          Show more
        </Button>
      </Link>
    </div>
  );
};

export default PeoplesList;
