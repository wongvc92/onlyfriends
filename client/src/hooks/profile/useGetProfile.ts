import { useQuery } from "@tanstack/react-query";
import { profileKeys } from "./profileKeys";
import apiClient from "@/utils/apiClient";
import { IProfile } from "@/types/IProfiles";

const getProfileByUsername = async (username: string): Promise<IProfile> => {
  const url = `/api/profiles/${username}`;
  const res = await apiClient.get(url);
  return res.data.profile;
};

export const useGetProfile = ({ username }: { username?: string }) => {
  return useQuery({
    queryKey: profileKeys.detail(username as string),
    queryFn: () => getProfileByUsername(username as string),
    enabled: !!username,
  });
};
