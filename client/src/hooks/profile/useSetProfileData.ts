import { useQueryClient } from "@tanstack/react-query";
import { profileKeys } from "./profileKeys";
import { ICreateProfileRespose } from "./useCreateProfile";
import { IEditProfileResponse } from "./useEditProfile";

export const useSetProfileData = () => {
  const queryClient = useQueryClient();
  const createProfileData = (data: ICreateProfileRespose) => {
    queryClient.setQueryData(profileKeys.detail(data.profile.username), () => data.profile);
  };

  const editProfileData = (data: IEditProfileResponse) => {
    queryClient.setQueryData(profileKeys.detail(data.profile.username), () => data.profile);
  };
  return { createProfileData, editProfileData };
};
