import { TProfileSchema } from "@/validation/profileSchema";

export const getProfile = async () => {
  const url = new URL("http://localhost:5001/api/profiles");
  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch profile");
  }
  const data = await res.json();
  const profile: TProfileSchema = data.profile;
  return profile;
};
