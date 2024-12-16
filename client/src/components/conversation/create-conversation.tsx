import React from "react";
import { CgMail } from "react-icons/cg";
import { useCreateConversation } from "@/hooks/conversation/useCreateConversation";
import SubmitButton from "../common/submit-button";

interface CreateProps {
  userId: string;
}
const CreateConversation: React.FC<CreateProps> = ({ userId }) => {
  const { mutate: createCoversation, isPending } = useCreateConversation();

  const onCreateChat = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId) return;
    createCoversation(userId);
  };

  return (
    <form onSubmit={onCreateChat}>
      <SubmitButton Icon={<CgMail />} isLoading={isPending} variant="link" />
    </form>
  );
};

export default CreateConversation;
