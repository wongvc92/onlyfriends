import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
import Spinner from "./ui/spinner";
import { toast } from "sonner";

const AddFriendButton = ({ peopleId }: { peopleId: string }) => {
  const queryClient = useQueryClient();
  const followPeople = async () => {
    const url = "http://localhost:5001/api/friends";
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
      queryClient.invalidateQueries({ queryKey: ["peoples"] });
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
    <Button type="button" className="rounded-full" size="sm" onClick={onFollowPeople}>
      {isPending ? (
        <div className="flex items-center gap-1">
          <Spinner color="white" size="4" /> Adding...
        </div>
      ) : (
        "Add"
      )}
    </Button>
  );
};

export default AddFriendButton;
