import apiClient from "@/utils/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { friendKeys } from "./friendKeys";
import { peopleKeys } from "../people/peopleKeys";
import { profileKeys } from "../profile/profileKeys";

const approveFriend = async (friendRequestId: string) => {
  const url = `/api/friends/${friendRequestId}`;
  const res = await apiClient.put(url);
  return res.data;
};

export const useApproveFriend = ({ username }: { username?: string }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (friendRequestId: string) => approveFriend(friendRequestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.detail(username as string) });
      queryClient.invalidateQueries({ queryKey: friendKeys.all });
      queryClient.invalidateQueries({ queryKey: peopleKeys.all });
      toast.success("Approved friend request!");
    },
    onError: () => {
      toast.error("Please try again later");
    },
  });
};