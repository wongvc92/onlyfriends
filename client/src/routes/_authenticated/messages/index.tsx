import {
  createFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { z } from "zod";

const conversationsSchema = z.object({
  query: z.string().optional(),
  username: z.string().optional(),
});

export type ConversationsSchema = z.infer<typeof conversationsSchema>;
export const Route = createFileRoute("/_authenticated/messages/")({
  validateSearch: (search) => conversationsSchema.parse(search),
  component: Page,
});

function Page() {
  const navigate = useNavigate();

  const { conversationId } = useParams({ strict: false });
  useEffect(() => {
    navigate({
      to: `/messages/conversations`,
      replace: true,
    });
  }, [conversationId, navigate]);

  return null;
}
