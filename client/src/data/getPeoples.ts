import { IPeople } from "@/types/IPeople";

const BASE_URL = import.meta.env.VITE_SERVER_URL!;

export const getPeoples = async () => {
  const url = `${BASE_URL}/api/peoples`;

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch peoples");
  }
  const data = await res.json();
  const peoples: IPeople[] = data.peoples;
  return peoples;
};
