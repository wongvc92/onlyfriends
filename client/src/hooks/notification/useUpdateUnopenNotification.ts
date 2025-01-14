import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/context/auth";
import { useSetNotificationData } from "./useSetNotificationData";
import { UpdateUnopenNotification } from "@/api/notification/UpdateUnopenNotification";

export const useUpdateUnopenNotification = () => {
  const { user } = useAuth();
  const { updateUnopenNotificationCount } = useSetNotificationData();
  return useMutation({
    mutationFn: UpdateUnopenNotification,
    onError: (data) => {
      console.log("error", data);
      toast.error("something went wrong, please try again later.");
    },
    onSuccess: () => {
      updateUnopenNotificationCount({ userId: user?.id as string, type: "reset" });
    },
  });
};
