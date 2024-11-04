import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import AddFriendButton from "./add-friend-button";
import { Button } from "../ui/button";
import Spinner from "../ui/spinner";

const BASE_URL = import.meta.env.VITE_SERVER_URL!;

const CancelAddFriendButton = ({ peopleId }: { peopleId: string }) => {
  const unfriendPeople = async () => {
    const url = `${BASE_URL}/api/friends/${peopleId}`;
    const res = await fetch(url, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Failed add friend");
    }
  };
  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: unfriendPeople,
    onSuccess: () => {
      toast.success("Cancelled friend request");
    },
    onError: () => {
      toast.error("Please try again later");
    },
  });

  const onUnfriendPeople = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    mutate();
  };

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        className={`rounded-full ${isSuccess ? "hidden" : "block"}`}
        size="sm"
        onClick={onUnfriendPeople}
        disabled={isPending}
      >
        {isPending ? (
          <div className="flex items-center gap-1">
            <Spinner color="white" size="4" /> Cancelling...
          </div>
        ) : (
          "Cancel request"
        )}
      </Button>
      {isSuccess && <AddFriendButton peopleId={peopleId} />}
    </>
  );
};

export default CancelAddFriendButton;
