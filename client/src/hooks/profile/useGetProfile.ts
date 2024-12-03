import { useQuery } from "@tanstack/react-query";
import { IProfile } from "@/types/IProfiles";
import { basePath } from "@/utils/utils";

const getProfileByUsername = async (username: string) => {
  const url = basePath(`/api/profiles/${username}`);

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch profile");
  }
  const data = await res.json();
  const profile: IProfile = data.profile;
  return profile;
};

export const useGetProfile = (username?: string) => {
  return useQuery({
    queryKey: ["peofiles", username],
    queryFn: () => getProfileByUsername(username as string),
    enabled: !!username,
  });
};
