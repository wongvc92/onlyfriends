import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import AddFriendButton from "./add-friend-button";
import { Button } from "../ui/button";
import Spinner from "../ui/spinner";

const BASE_URL = import.meta.env.VITE_SERVER_URL!;

const UnfriendButton = ({ peopleId }: { peopleId: string }) => {
  const queryClient = useQueryClient();
  const unfriendPeople = async () => {
    const url = `${BASE_URL}/api/friends/${peopleId}`;
    const res = await fetch(url, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed add friend");
    }
  };
  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: unfriendPeople,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["peoples"] });
      await queryClient.invalidateQueries({ queryKey: ["friends-pending"] });
      await queryClient.invalidateQueries({ queryKey: ["friends-accepted"] });
      await queryClient.invalidateQueries({ queryKey: [`friendStatus-${peopleId}`] });
      toast.success("Removed friend from list");
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
      <Button type="button" className={`rounded-full ${isSuccess ? "hidden" : "block"}`} size="sm" onClick={onUnfriendPeople} disabled={isPending}>
        {isPending ? (
          <div className="flex items-center gap-1">
            <Spinner color="white" size="4" />
          </div>
        ) : (
          "Unfriend"
        )}
      </Button>
      {isSuccess && <AddFriendButton peopleId={peopleId} />}
    </>
  );
};

export default UnfriendButton;
