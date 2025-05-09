/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { getSession } from "next-auth/react";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      accessToken?: string;
      decodedToken?: any;
    };
  }
  interface User {
    accessToken?: string;
    decodedToken?: any;
}

interface JWT {
    accessToken?: string;
    decodedToken?: any;
}
}

const clientManagementInstance = (): AxiosInstance => {
  const axiosInstance = axios.create({
    baseURL: "https://api-task-qikearn.vercel.app/v1",
  });

  axiosInstance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      try {
        const session = await getSession();

        if (session?.user?.accessToken) {
          config.data = {
            ...config.data,
            accessToken: session.user.accessToken,
          };
        }

        return config;
      } catch (error) {
        console.error("Error fetching session:", error);
        return config;
      }
    },
    (error: Error) => Promise.reject(error)
  );

  return axiosInstance;
};

export default clientManagementInstance;