import { useQuery } from "@tanstack/react-query";
import { getFriendsRequest } from "@/data/getFriendsRequests";
import ApproveFriendButton from "./approve-friend-button";
import Spinner from "../ui/spinner";
import { Button } from "../ui/button";
import ProfileImage from "../profile/profile-image";
import ProfileName from "../profile/profile-name";
import ProfileUsername from "../profile/profile-username";

const FriendRequest = () => {
  const { data: friendsRequests, isLoading, error } = useQuery({ queryKey: ["friends"], queryFn: getFriendsRequest });

  console.log("friendsRequests", friendsRequests);

  if (isLoading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div>Something went wrong please try again.</div>;
  }
  return (
    <div className="border rounded-md p-2 space-y-4 ">
      <div>Friends request</div>
      <div className="space-y-4">
        {friendsRequests?.map((friendRequest) => (
          <div key={friendRequest.id} className="flex items-center justify-between">
            <div className="flex items-start gap-2">
              <ProfileImage image="https://github.com/shadcn.png" username={friendRequest.username} classname="w-10 h-10" />
              <div>
                <ProfileName name={friendRequest.name} classname="font-bold text-sm" />
                <ProfileUsername username={friendRequest.username} classname="font-light text-muted-foreground text-xs" />
              </div>
            </div>
            {<ApproveFriendButton friendRequestId={friendRequest.id} />}
          </div>
        ))}
      </div>
      <Button type="button" variant="link" className="text-blue-500" size="sm">
        Show more
      </Button>
    </div>
  );
};

export default FriendRequest;
