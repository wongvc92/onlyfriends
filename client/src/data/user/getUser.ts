import { IUserClient } from "@/types/ICheckAuth";
import apiClient from "@/utils/apiClient";

export const getUser = async (): Promise<IUserClient> => {
  const url = "/api/user";
  const response = await apiClient.get(url);
  return response.data.user;
};
