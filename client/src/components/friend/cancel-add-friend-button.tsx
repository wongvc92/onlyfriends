import AddFriendButton from "./add-friend-button";
import { useCancelAddFriend } from "@/hooks/friend/useCancelAddFriend";
import SubmitButton from "../common/submit-button";
import { CgUserRemove } from "react-icons/cg";

const CancelAddFriendButton = ({ peopleId }: { peopleId: string }) => {
  const { mutate, isPending, isSuccess } = useCancelAddFriend();

  const onUnfriendPeople = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(peopleId);
  };

  return (
    <>
      {isSuccess ? (
        <AddFriendButton peopleId={peopleId} />
      ) : (
        <form onSubmit={onUnfriendPeople}>
          <SubmitButton
            defaultTitle="Cancel request"
            isLoading={isPending}
            isLoadingTitle="Cancelling..."
            Icon={<CgUserRemove />}
            hideTitle={true}
            variant="secondary"
          />
        </form>
      )}
    </>
  );
};

export default CancelAddFriendButton;
