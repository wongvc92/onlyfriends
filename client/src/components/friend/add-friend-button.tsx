import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "../ui/button";
import Spinner from "../ui/spinner";
import CancelAddFriendButton from "./cancel-add-friend-button";

const BASE_URL = import.meta.env.VITE_SERVER_URL!;

const AddFriendButton = ({ peopleId }: { peopleId: string }) => {
  const queryClient = useQueryClient();
  const followPeople = async () => {
    const url = `${BASE_URL}/api/friends`;
    const res = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ peopleId }),
    });

    if (!res.ok) {
      throw new Error("Failed add friend");
    }
  };
  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: followPeople,
    onSuccess: () => {
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["peoples"] });
        queryClient.invalidateQueries({ queryKey: [`friendStatus-${peopleId}`] });
      }, 60000); // 60,000 milliseconds = 1 minute
      toast.success("Friend request sent");
    },
    onError: () => {
      toast.error("Please try again later");
    },
  });

  const onFollowPeople = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    mutate();
  };

  return (
    <>
      <Button type="button" className={`rounded-full ${isSuccess ? "hidden" : "block"}`} size="sm" onClick={onFollowPeople} disabled={isPending}>
        {isPending ? (
          <div className="flex items-center gap-1">
            <Spinner color="white" size="4" /> Adding...
          </div>
        ) : (
          "Add Friend"
        )}
      </Button>
      {isSuccess && <CancelAddFriendButton peopleId={peopleId} />}
    </>
  );
};

export default AddFriendButton;
