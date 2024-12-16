import { TPeopleSchema } from "@/routes/_authenticated/friends/_layout/find";

export const peopleKeys = {
  all: ["peoples"] as const,
  lists: () => [...peopleKeys.all, "lists"] as const,
  list: (filters: TPeopleSchema) => [...peopleKeys.lists(), { filters }] as const,
  details: () => [...peopleKeys.all, "details"] as const,
  detail: (id: string) => [...peopleKeys.details(), id] as const,
};
