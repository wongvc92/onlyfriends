import axios from "axios";
import { basePath } from "./basePath";
import { useNavigate } from "@tanstack/react-router";

const options = {
  baseURL: basePath(),
  withCredentials: true,
  timeout: 10000,
};

const apiClient = axios.create(options);

export const APIRefresh = axios.create({
  baseURL: basePath(),
  withCredentials: true,
  timeout: 10000,
});
APIRefresh.interceptors.response.use((response) => response);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { data, status, config } = error.response;

    console.log("api client status", status);
    console.log("api client data", data);

    // Prevent retrying for specific endpoints like refresh token
    if (config.url.includes("/api/auth/renew-access-token")) {
      return Promise.reject(error);
    }

    if (status === 401 && data.message === "access token not found") {
      try {
        await APIRefresh.get("/api/auth/renew-access-token");
        return APIRefresh(error.config);
      } catch (refreshError: any) {
        const { data: refreshErrorData } = refreshError.response || {};

        if (refreshErrorData?.message === "Refresh token not found") {
          console.log("Refresh token not found. Redirecting to login...");

          // Prevent loop by ensuring we don't redirect from the login page
          if (window.location.pathname !== "/") {
            window.location.href = "/";
          }
        } else {
          console.error("Error refreshing token:", refreshError);
        }
      }
    }

    return Promise.reject({
      ...data,
    });
  }
);

export default apiClient;
