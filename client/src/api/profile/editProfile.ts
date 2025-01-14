import { IProfile } from "@/types/IProfiles";
import apiClient from "@/utils/apiClient";
import { TProfileSchema } from "@/validation/profileSchema";

export interface IEditProfileResponse {
    profile: IProfile;
    message: string;
  }
  export const editProfile = async (payload: TProfileSchema): Promise<IEditProfileResponse> => {
    const url = `/api/profiles/${payload.id}`;
    const res = await apiClient.put(url, payload);
    return res.data;
  };