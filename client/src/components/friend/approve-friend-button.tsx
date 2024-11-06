import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "../ui/button";
import Spinner from "../ui/spinner";
import { useParams } from "@tanstack/react-router";

const BASE_URL = import.meta.env.VITE_SERVER_URL!;

const ApproveFriendButton = ({ friendRequestId }: { friendRequestId: number }) => {
  const queryClient = useQueryClient();
  const { username } = useParams({ strict: false });
  const approveFriend = async () => {
    const url = `${BASE_URL}/api/friends/${friendRequestId}`;
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
    mutationFn: approveFriend,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`profiles-${username}`] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["peoples"] });
      queryClient.invalidateQueries({ queryKey: ["friends-pending"] });
      queryClient.invalidateQueries({ queryKey: ["friends-accepted"] });
    },
    onError: () => {
      toast.error("Please try again later");
    },
  });

  const onApproveFriend = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    mutate();
  };

  return (
    <Button type="button" className="rounded-full w-fit ml-auto" size="sm" onClick={onApproveFriend}>
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
