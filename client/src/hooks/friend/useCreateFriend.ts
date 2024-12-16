import apiClient from "@/utils/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { peopleKeys } from "../people/peopleKeys";
import { profileKeys } from "../profile/profileKeys";
import { friendKeys } from "./friendKeys";

const createFriend = async (peopleId: string) => {
  const url = "/api/friends";
  const res = await apiClient.post(url, { peopleId });
  return res.data;
};
export const useCreateFriend = ({ username, peopleId }: { username?: string; peopleId: string }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => createFriend(peopleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: peopleKeys.all });
      queryClient.invalidateQueries({ queryKey: profileKeys.detail(username as string) });
      queryClient.invalidateQueries({ queryKey: friendKeys.all });

      toast.success("Friend request sent");
    },
    onError: (error) => {
      toast.error(error.message || "Please try again later");
    },
  });
};
