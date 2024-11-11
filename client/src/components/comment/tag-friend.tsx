import { getAcceptedFriends } from "@/data/getAcceptedFriends";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import Spinner from "../ui/spinner";
import ProfileImage from "../profile/profile-image";
import ProfileName from "../profile/profile-name";
import ProfileUsername from "../profile/profile-username";

interface TagFriendProps {
  debouncedSearch: string;

  handleTaggedFriend: (username: string) => void;
}
const TagFriend: React.FC<TagFriendProps> = ({ debouncedSearch,handleTaggedFriend }) => {
  const { ref, inView } = useInView();
  const { status, data, error, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage, isPending, isLoading } = useInfiniteQuery({
    queryKey: ["friends-accepted", debouncedSearch],
    queryFn: ({ pageParam }) => getAcceptedFriends({ pageParam, debouncedSearch }),
    initialPageParam: 1,
    enabled: Boolean(debouncedSearch),
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  if (isLoading) {
    return <Spinner size="4" />;
  }

  if (error) {
    return <div>Something went wrong please try again.</div>;
  }

  if (!data) return null;
  return (
    <>
      {data.pages[0].data.length > 0 && (
        <div className=" p-2 space-y-2 border rounded-md bg-white shadow-lg z-20">
          {data?.pages?.map((page, pageIndex) => (
            <React.Fragment key={pageIndex}>
              {page.data.map((friend) => (
                <div
                  key={friend.id}
                  className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleTaggedFriend(friend.username)}
                >
                  <ProfileImage image={friend.display_image} username={friend.username} classname="w-8 h-8" />
                  <div>
                    <ProfileName name={friend.name} classname="font-bold text-sm" />
                    <ProfileUsername username={friend.username} classname="text-xs text-muted-foreground" />
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))}
          <div ref={ref} className="text-center">
            {isFetchingNextPage ? "Loading more..." : hasNextPage ? "Load more" : ""}
          </div>
        </div>
      )}
    </>
  );
};

export default TagFriend;
