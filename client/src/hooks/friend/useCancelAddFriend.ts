import apiClient from "@/utils/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { friendKeys } from "./friendKeys";
import { peopleKeys } from "../people/peopleKeys";
import { useSearch } from "@tanstack/react-router";

const cancelAddFriend = async (peopleId: string) => {
  const url = `/api/friends/${peopleId}`;
  const res = await apiClient.delete(url);
  return res.data;
};

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
