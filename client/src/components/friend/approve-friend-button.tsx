import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "../ui/button";
import Spinner from "../ui/spinner";

const ApproveFriendButton = ({ friendRequestId }: { friendRequestId: string }) => {
  console.log("friendRequestId", friendRequestId);
  const queryClient = useQueryClient();
  const unfriendPeople = async () => {
    const url = `http://localhost:5001/api/friends/${friendRequestId}`;
    const res = await fetch(url, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed add friend");
    }

    return await res.json();
  };
  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: unfriendPeople,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["peoples"] });
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
    <Button type="button" className="rounded-full" size="sm" onClick={onUnfriendPeople}>
      {isPending ? (
        <div className="flex items-center gap-1">
          <Spinner color="white" size="4" /> Approving...
        </div>
      ) : (
        "Approve"
      )}
    </Button>
  );
};

export default ApproveFriendButton;
