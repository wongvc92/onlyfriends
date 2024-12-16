import { useParams } from "@tanstack/react-router";
import { useApproveFriend } from "@/hooks/friend/useApproveFriend";
import SubmitButton from "../common/submit-button";
import { CgUserAdd } from "react-icons/cg";

const ApproveFriendButton = ({ friendRequestId }: { friendRequestId: string }) => {
  const { username } = useParams({ strict: false });

  const { mutate, isPending } = useApproveFriend({ username });

  const onApproveFriend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(friendRequestId);
  };

  return (
    <form onSubmit={onApproveFriend}>
      <SubmitButton
        isLoading={isPending}
        defaultTitle="Approve"
        isLoadingTitle=" Approving..."
        className="flex items-center gap-1"
        Icon={<CgUserAdd />}
        hideTitle={true}
      />
    </form>
  );
};

export default ApproveFriendButton;
