import { useQuery } from "@tanstack/react-query";
import { getFriendsRequest } from "@/data/getFriendsRequests";
import ApproveFriendButton from "./approve-friend-button";
import Spinner from "../ui/spinner";
import { Button } from "../ui/button";

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
              <img src="https://github.com/shadcn.png" alt={`${friendRequest.username}-image`} className="w-10 h-10 rounded-full object-cover" />
              <div>
                <p className="font-bold">{friendRequest.name}</p>
                <p className="font-light text-muted-foreground">@{friendRequest.username}</p>
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
