import { Button } from "../ui/button";
import { useParams, useSearch } from "@tanstack/react-router";
import { useAuth } from "@/context/auth";
import { IoSend } from "react-icons/io5";
import DynamicTextarea from "../ui/dynamic-textarea";
import { useGetProfile } from "@/hooks/profile/useGetProfile";
import { IPrivateMessage } from "@/types/IPrivateMessage";
import { useCreateMessage } from "@/hooks/message/useCreateMessage";
import { useState } from "react";
import { messageSchema } from "@/validation/messageSchema";
import { toast } from "sonner";
import SubmitButton from "../common/submit-button";

const AddForm = () => {
  const { conversationId } = useParams({ from: "/_authenticated/messages/_layout/conversations/_layout/$conversationId/" });
  const auth = useAuth();
  const { username } = useSearch({ strict: false });
  const { data: profile } = useGetProfile({ username });
  const { mutate, isPending } = useCreateMessage();
  const [inputValue, setInputValue] = useState("");

  console.log("profile", profile);
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setInputValue(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const privivateMessage: IPrivateMessage = {
      text: inputValue,
      sender_id: auth.user?.id!,
      recipient_id: profile?.user_id!,
      conversationId,
    };

    const parsedResult = messageSchema.safeParse(privivateMessage);
    if (!parsedResult.success) {
      console.log("error: ", parsedResult.error.errors.map((e) => `${e.path}-${e.message}`).join(", "));
      toast.error("Please check input.");
      return;
    }
    mutate(
      { privivateMessage: parsedResult.data as IPrivateMessage },
      {
        onSuccess: () => {
          setInputValue("");
        },
      }
    );
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="relative">
        <DynamicTextarea name="text" id="text" className="pr-20" value={inputValue} onChange={onChange} disabled={isPending} />
        <SubmitButton className="absolute right-1 bottom-1" disabled={inputValue.length === 0} isLoading={isPending} Icon={<IoSend />} />
      </div>
    </form>
  );
};

export default AddForm;
