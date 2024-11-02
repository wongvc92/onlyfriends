import { IProfile } from "@/types/IProfiles";

export const getProfileByUsername = async (username: string) => {
  const url = new URL(`http://localhost:5001/api/profiles/${username}`);
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
