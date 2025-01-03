import apiClient from "@/utils/apiClient";
import { TProfileSchema } from "@/validation/profileSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { profileKeys } from "./profileKeys";
import { useNavigate } from "@tanstack/react-router";
import { urlToFile } from "@/lib/cropImage";
import { useImageUploadManager } from "../common/useImageUploadManager";
import { IProfile } from "@/types/IProfiles";

interface ICreateProfileRespose {
  profile: IProfile;
  message: string;
}
const createProfile = async (payload: TProfileSchema): Promise<ICreateProfileRespose> => {
  const url = "/api/profiles";
  const res = await apiClient.post(url, payload);
  return res.data;
};

export const useCreateProfile = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { uploadImageToS3 } = useImageUploadManager();
  return useMutation({
    mutationFn: async (payload: TProfileSchema) => {
      const convertedUrlToFileBannerImage = await urlToFile(payload.banner_image, "image-file.png", "image/png");
      const signedBannerImage = (await uploadImageToS3(convertedUrlToFileBannerImage)) || "";

      const convertedUrlToFileDisplayImage = await urlToFile(payload.display_image, "image-file.png", "image/png");
      const signedisplayImage = (await uploadImageToS3(convertedUrlToFileDisplayImage)) || "";

      return createProfile({ ...payload, banner_image: signedBannerImage, display_image: signedisplayImage });
    },
    onError: (error: any) => {
      if (error.errors) {
        toast.error(error.errors[0].message);
      } else if (error.message) {
        console.log(error.message);
        toast.error(error.message);
      } else {
        console.log(error.message);
        toast.error("Something went wrong. Please try again.");
      }
    },
    onSuccess: (data) => {
      toast.success("Successfully add profile!");
      queryClient.setQueryData(profileKeys.detail(data.profile.username), () => data.profile);
      navigate({ to: `/${data.profile.username}` });
    },
  });
};
