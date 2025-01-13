import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import Spinner from "../ui/spinner";
import ProfileImage from "../profile/profile-image";
import ProfileName from "../profile/profile-name";
import ProfileUsername from "../profile/profile-username";
import { cn } from "@/lib/utils";
import { useGetAcceptedFriends } from "@/hooks/friend/useGetAcceptedFriends";

interface TagFriendProps {
  debouncedSearch: string;
  handleTaggedFriend: (username: string) => void;
  classname?: string;
}

const TagFriend: React.FC<TagFriendProps> = ({ debouncedSearch, handleTaggedFriend, classname }: TagFriendProps) => {
  const { ref, inView } = useInView();
  const { data, error, isFetchingNextPage, fetchNextPage, hasNextPage, isLoading } = useGetAcceptedFriends({ query: debouncedSearch });

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
    <div className="absolute">
      {data.pages[0].data.length > 0 && (
        <div className={cn(" p-2 space-y-2 border rounded-md bg-white shadow-lg z-20", classname)}>
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
    </div>
  );
};

export default TagFriend;
