import CancelAddFriendButton from "./cancel-add-friend-button";
import { useParams } from "@tanstack/react-router";
import SubmitButton from "../common/submit-button";
import { useCreateFriend } from "@/hooks/friend/useCreateFriend";
import { CgUserAdd } from "react-icons/cg";

const AddFriendButton = ({ peopleId }: { peopleId: string }) => {
  const { username } = useParams({ strict: false });
  const { mutate, isPending, isSuccess } = useCreateFriend({ username, peopleId });

  const onFollowPeople = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate();
  };

  return (
    <>
      {isSuccess ? (
        <CancelAddFriendButton peopleId={peopleId} />
      ) : (
        <form onSubmit={onFollowPeople}>
          <SubmitButton Icon={<CgUserAdd />} defaultTitle="Add Friend" isLoading={isPending} isLoadingTitle="Adding..." hideTitle={true} />
        </form>
      )}
    </>
  );
};

export default AddFriendButton;
