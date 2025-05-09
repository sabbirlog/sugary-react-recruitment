import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

const clientManagementInstance = (): AxiosInstance => {
  const axiosInstance = axios.create({
    baseURL: "https://sugarytestapi.azurewebsites.net",
  });

  axiosInstance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      try {
        // Get the token from localStorage
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

        if (token) {
          config.data = {
            ...config.data,
            accessToken: token,
          };
        }

        return config;
      } catch (error) {
        console.error("Error setting token in request:", error);
        return config;
      }
    },
    (error: Error) => Promise.reject(error)
  );

  return axiosInstance;
};

export default clientManagementInstance;
