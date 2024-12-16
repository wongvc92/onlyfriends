import AddFriendButton from "./add-friend-button";
import { useDeleteFriend } from "@/hooks/friend/useDeleteFriend";
import SubmitButton from "../common/submit-button";
import { CgUserList, CgUserRemove } from "react-icons/cg";

const UnfriendButton = ({ peopleId }: { peopleId: string }) => {
  console.log("UnfriendButton peopleId", peopleId);
  const { mutate, isPending, isSuccess } = useDeleteFriend({ peopleId });

  const onUnfriendPeople = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate();
  };

  return (
    <>
      {isSuccess ? (
        <AddFriendButton peopleId={peopleId} />
      ) : (
        <form onSubmit={onUnfriendPeople}>
          <SubmitButton
            defaultTitle="Unfriend"
            isLoading={isPending}
            className={`rounded-full ${isSuccess ? "hidden" : "block"}`}
            Icon={<CgUserRemove />}
            hideTitle
          />
        </form>
      )}
    </>
  );
};

export default UnfriendButton;
