import FindPeoplePage from "@/components/people/find-people-page";
import { getPeopleSchema } from "@/validation/peopleValidation";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/friends/_layout/find/")({
  validateSearch: getPeopleSchema,
  component: FindPeoplePage,
});
