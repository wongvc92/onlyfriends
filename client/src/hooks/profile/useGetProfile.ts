import { useQuery } from "@tanstack/react-query";
import { profileKeys } from "./profileKeys";
import { getProfileByUsername } from "@/api/profile/getProfileByUsername";

export const useGetProfile = ({ username }: { username?: string }) => {
  return useQuery({
    queryKey: profileKeys.detail(username as string),
    queryFn: () => getProfileByUsername(username as string),
    enabled: !!username,
  });
};
