import { getFriendStatusByPeopleId } from "@/data/getFriendStatusByPeopleId";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/auth";
import UnfriendButton from "./unfriend-button";
import CancelAddFriendButton from "./cancel-add-friend-button";
import ApproveFriendButton from "./approve-friend-button";
import { useParams } from "@tanstack/react-router";
import AddFriendButton from "./add-friend-button";

const FriendStatus = ({ peopleId }: { peopleId: string }) => {
  const { data } = useQuery({ queryKey: [`friendStatus-${peopleId}`], queryFn: () => getFriendStatusByPeopleId(peopleId) });
  const { username } = useParams({ strict: false });
  const { user } = useAuth();

  if (!data) return null;

  const isInitiator = data.friendStatus?.initiated_by === user?.id;
  const isFriend = data.friendStatus?.status === "accepted";
  const isPendingFriendRequest = data.friendStatus?.status === "pending";

  if (data) {
    if (isFriend) {
      return <UnfriendButton peopleId={peopleId} />;
    }
    if (isPendingFriendRequest) {
      if (isInitiator) {
        return <CancelAddFriendButton peopleId={peopleId} />;
      } else {
        return (
          <div className="flex flex-col pl-2 space-y-2 justify-end">
            <p className="text-xs text-muted-foreground text-right">@{username} sent you friend request</p>
            <ApproveFriendButton friendRequestId={data.friendStatus?.id} />
          </div>
        );
      }
    }
  }

  return <AddFriendButton peopleId={peopleId} />;
};

export default FriendStatus;
