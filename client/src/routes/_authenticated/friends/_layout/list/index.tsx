import AcceptedListPage from "@/components/friend/accepted-list-page";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const friendListSchema = z.object({
  query: z.string().optional(),
});

export const Route = createFileRoute("/_authenticated/friends/_layout/list/")({
  validateSearch: (search) => friendListSchema.parse(search),
  component: AcceptedListPage,
});
