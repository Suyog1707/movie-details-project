import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
  timeout: 10000,
});

axiosClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Don't retry refresh request itself
    if (originalRequest.url.includes("/refresh-token")) {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/v1/user/refresh-token`,
          {},
          {
            withCredentials: true,
          }
        );

        return axiosClient(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;