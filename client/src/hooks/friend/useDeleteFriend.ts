import apiClient from "@/utils/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { peopleKeys } from "../people/peopleKeys";
import { friendKeys } from "./friendKeys";

const deleteFriend = async (peopleId: string) => {
  console.log("peopleId", peopleId);
  const url = `/api/friends/${peopleId}`;
  const res = await apiClient.delete(url);
  return res.data;
};

export const useDeleteFriend = ({ peopleId }: { peopleId: string }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteFriend(peopleId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: peopleKeys.all });
      await queryClient.invalidateQueries({ queryKey: friendKeys.all });
      await queryClient.invalidateQueries({ queryKey: [`friendStatus-${peopleId}`] });
      toast.success("Removed friend from list");
    },
    onError: () => {
      toast.error("Please try again later");
    },
  });
};
