import { IProfile } from "@/types/IProfiles";
import apiClient from "@/utils/apiClient";

export const getProfileByUsername = async (username: string): Promise<IProfile> => {
  const url = `/api/profiles/${username}`;
  const res = await apiClient.get(url);
  return res.data.profile;
};
