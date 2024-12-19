import { useQuery } from "@tanstack/react-query";
import { friendKeys } from "./friendKeys";
import { getFriendStatusByPeopleId } from "@/data/friend/getFriendStatusByPeopleId";

export const useGetFriendStatus = ({ peopleId }: { peopleId: string }) => {
  return useQuery({
    queryKey: friendKeys.status(peopleId),
    queryFn: () => getFriendStatusByPeopleId(peopleId),
  });
};