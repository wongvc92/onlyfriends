import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { friendKeys } from "./friendKeys";
import { cancelAddFriend } from "@/api/friend/cancelAddFriend";

export const useCancelAddFriend = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelAddFriend,
    onError: (error) => {
      toast.error(error.message || "Failed to cancel friend request.");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: friendKeys.all,
      });

      toast.success("Cancelled friend request");
    },
  });
};
