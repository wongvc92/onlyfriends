import FindPeoplePage from "@/components/people/find-people-page";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const peopleSchema = z.object({
  query: z.string().optional(),
});

export type TPeopleSchema = z.infer<typeof peopleSchema>;

export const Route = createFileRoute("/_authenticated/friends/_layout/find/")({
  validateSearch: (search) => peopleSchema.parse(search),
  component: FindPeoplePage,
});
