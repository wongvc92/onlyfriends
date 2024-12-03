import React from "react";
import { Button } from "../ui/button";
import { CgMail } from "react-icons/cg";
import { useCreateConversation } from "@/hooks/conversation/useCreateConversation";

interface CreateProps {
  userId: string;
}
const Create: React.FC<CreateProps> = ({ userId }) => {
  const { mutate: createCoversation } = useCreateConversation();

  const onCreateChat = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!userId) return;
    createCoversation(userId);
  };

  return (
    <Button onClick={onCreateChat} type="button">
      <CgMail />
    </Button>
  );
};

export default Create;
