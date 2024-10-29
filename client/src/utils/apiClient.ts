type ApiClientOptions = RequestInit;

const apiClient = async (url: string, options: ApiClientOptions = {}, retry = true): Promise<any> => {
  try {
    const response = await fetch(url, {
      ...options,
      credentials: "include", // Include cookies
    });

    if (!response.ok && retry) {
      // Attempt to refresh the access token
      const refreshResponse = await fetch("/api/refresh-token", {
        method: "POST",
        credentials: "include",
      });

      if (refreshResponse.ok) {
        // Retry the original request
        return apiClient(url, options, false);
      } else {
        // Refresh token is invalid or expired
        console.error("Refresh token failed");
        // Optionally handle logout or redirection here
        // window.location.href = "/login";
        return { error: "An error occurred" };
        // throw new Error("Session expired. Please log in again.");
      }
    }

    if (!response.ok) {
      // Handle other HTTP errors
      let errorData: any = {};
      try {
        errorData = await response.json();
      } catch (parseError) {
        console.error("Error parsing error response:", parseError);
        // If parsing fails, use status text
        return { error: errorData.message || "An error occurred" };
        // errorData.message = response.statusText || "An error occurred";
      }
      // throw new Error(errorData.message || "An error occurred");
    }

    // Parse and return the response data
    let data: any = {};
    try {
      data = await response.json();
    } catch (parseError) {
      // Handle cases where there is no content or invalid JSON
      console.error("Error parsing response data:", parseError);
      data = null; // or handle as needed
    }

    return data;
  } catch (error) {
    // Optionally, handle network errors differently
    console.error("Network or server error:", error);
    throw error;
  }
};

export default apiClient;
