import { IPeople } from "@/types/IPeople";

export const getPeoples = async () => {
  const url = "http://localhost:5001/api/peoples";

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
