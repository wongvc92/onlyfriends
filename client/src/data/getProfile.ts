import { IProfile } from "@/types/IProfiles";
const BASE_URL = import.meta.env.VITE_SERVER_URL!;

export const getProfileByUsername = async (username: string) => {
  const url = `${BASE_URL}/api/profiles/${username}`;
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
