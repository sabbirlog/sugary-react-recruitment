import axios, { AxiosInstance } from "axios";
import Cookies from "js-cookie";

const clientManagementInstance = (): AxiosInstance => {
  const axiosInstance = axios.create({
    baseURL: "https://sugarytestapi.azurewebsites.net",
  });

  axiosInstance.interceptors.request.use((config) => {
    const token = Cookies.get("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      const accessToken = Cookies.get("accessToken");
      const refreshToken = Cookies.get("refreshToken");
      const accessTokenExpiresAt = Cookies.get("AccessTokenExpiresAt");
      const refreshTokenExpiresAt = Cookies.get("RefreshTokenExpiresAt");

      const now = new Date();

      const refreshExpired = refreshTokenExpiresAt
        ? new Date(refreshTokenExpiresAt) < now
        : true;

      const accessExpired = accessTokenExpiresAt
        ? new Date(accessTokenExpiresAt) < now
        : true;

      if (error.response?.status === 401) {
        if (refreshExpired) {
          Cookies.remove("accessToken");
          Cookies.remove("refreshToken");
          Cookies.remove("AccessTokenExpiresAt");
          Cookies.remove("RefreshTokenExpiresAt");

          if (typeof window !== "undefined") {
            window.location.href = "/";
          }
          return Promise.reject(error);
        }

        if (!originalRequest._retry && accessExpired && !refreshExpired) {
          originalRequest._retry = true;

          try {
            const refreshResponse = await axios.post(
              "https://sugarytestapi.azurewebsites.net/Account/RefreshToken",
              {
                AccessToken: accessToken,
                RefreshToken: refreshToken,
              }
            );

            const {
              Token: newAccessToken,
              RefreshToken: newRefreshToken,
              AccessTokenExpiresAt,
              RefreshTokenExpiresAt,
            } = refreshResponse.data;

            Cookies.set("accessToken", newAccessToken, {
              expires: new Date(AccessTokenExpiresAt),
            });

            Cookies.set("refreshToken", newRefreshToken, {
              expires: new Date(RefreshTokenExpiresAt),
            });

            Cookies.set("AccessTokenExpiresAt", AccessTokenExpiresAt);
            Cookies.set("RefreshTokenExpiresAt", RefreshTokenExpiresAt);

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            return axiosInstance(originalRequest);
          } catch (refreshError) {
            console.error("Refresh token failed", refreshError);

            Cookies.remove("accessToken");
            Cookies.remove("refreshToken");
            Cookies.remove("AccessTokenExpiresAt");
            Cookies.remove("RefreshTokenExpiresAt");

            if (typeof window !== "undefined") {
              window.location.href = "/";
            }

            return Promise.reject(refreshError);
          }
        }
      }

      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export default clientManagementInstance;
