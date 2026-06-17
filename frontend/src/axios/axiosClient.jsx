import axios from "axios"

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true
});

axiosClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        await axiosClient.post("/api/v1/user/refresh-");

        return axiosClient(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;