import { useAuth } from "@/context/auth";
import UnfriendButton from "./unfriend-button";
import CancelAddFriendButton from "./cancel-add-friend-button";
import ApproveFriendButton from "./approve-friend-button";
import { useParams } from "@tanstack/react-router";
import AddFriendButton from "./add-friend-button";
import { useGetFriendStatus } from "@/hooks/friend/useGetFriendStatus";

const FriendStatus = ({ peopleId }: { peopleId: string }) => {
  console.log("peopleId", peopleId);
  const { username } = useParams({ strict: false });
  const { user } = useAuth();
  const { data } = useGetFriendStatus({ peopleId });

  if (!data) return null;

  const isInitiator = data.friendStatus?.initiated_by === user?.id;
  const isFriend = data.friendStatus?.status === "accepted";
  const isPendingFriendRequest = data.friendStatus?.status === "pending";

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
          <ApproveFriendButton friendRequestId={data.friendStatus?.request_id} />
        </div>
      );
    }
  }

  return <AddFriendButton peopleId={peopleId} />;
};

export default FriendStatus;
