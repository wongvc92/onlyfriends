import { TProfileSchema } from "@/validation/profileSchema";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useImageUploadManager } from "../common/useImageUploadManager";
import { urlToFile } from "@/lib/cropImage";
import { toast } from "sonner";
import { useSetProfileData } from "./useSetProfileData";
import { editProfile } from "@/api/profile/editProfile";

export const useEditProfile = () => {
  const navigate = useNavigate();
  const { uploadImageToS3 } = useImageUploadManager();
  const { editProfileData } = useSetProfileData();
  return useMutation({
    mutationFn: async (payload: TProfileSchema) => {
      const convertedUrlToFileBannerImage = await urlToFile(payload.banner_image, "image-file.png", "image/png");
      const signedBannerImage = (await uploadImageToS3(convertedUrlToFileBannerImage)) || "";

      const convertedUrlToFileDisplayImage = await urlToFile(payload.display_image, "image-file.png", "image/png");
      const signedisplayImage = (await uploadImageToS3(convertedUrlToFileDisplayImage)) || "";

      return editProfile({ ...payload, banner_image: signedBannerImage, display_image: signedisplayImage });
    },
    onSuccess: (data) => {
      editProfileData(data);
      navigate({ to: `/${data.profile.username}` });
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
  });
};
