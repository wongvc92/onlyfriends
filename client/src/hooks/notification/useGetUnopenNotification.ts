import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/auth";
import { notificationKeys } from "./notificationKeys";
import { getUnopenNotification } from "@/data/notification/getUnopenNotification";

export const useGetUnopenNotification = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: notificationKeys.userUnopenNofications(user?.id as string),
    queryFn: () => getUnopenNotification({ user_id: user?.id as string }),
    enabled: !!user?.id,
  });
};
