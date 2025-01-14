import { IProfile } from "@/types/IProfiles";
import apiClient from "@/utils/apiClient";
import { TProfileSchema } from "@/validation/profileSchema";

export interface ICreateProfileRespose {
    profile: IProfile;
    message: string;
  }
  export const createProfile = async (payload: TProfileSchema): Promise<ICreateProfileRespose> => {
    const url = "/api/profiles";
    const res = await apiClient.post(url, payload);
    return res.data;
  };