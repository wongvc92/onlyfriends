import { createFileRoute } from "@tanstack/react-router";
import HomePage from "@/components/home/home-page";
import { getAllPostSchema } from "@/validation/postsSchema";

export const Route = createFileRoute("/_authenticated/home/")({
  validateSearch: getAllPostSchema,
  component: HomePage,
});
