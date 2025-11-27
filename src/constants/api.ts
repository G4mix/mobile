import axios, { AxiosInstance } from "axios";
import { getItem, setItem } from "./storage";
import { authEventEmitter } from "./authEventEmitter";

const globalForAxios = globalThis as unknown as {
  axiosInstance?: AxiosInstance;
};

const baseURL = `https://${process.env.EXPO_PUBLIC_API_URL}/v1`;

if (!globalForAxios.axiosInstance) {
  globalForAxios.axiosInstance = axios.create({
    baseURL,
  });
}
export const api = globalForAxios.axiosInstance;

let accessTokenCache: string | null = null;
export const clearAccessTokenCache = () => {
  accessTokenCache = null;
};
let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: any) => void;
}[] = [];

const processQueue = (error: any, token?: string) => {
  failedQueue.forEach((prom) =>
    token ? prom.resolve(token) : prom.reject(error),
  );
  failedQueue = [];
};

api.interceptors.request.use(
  async (config: any) => {
    if (config.skipAuth) {
      return config;
    }

    if (!accessTokenCache) {
      accessTokenCache = await getItem("accessToken");
    }

    if (accessTokenCache) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${accessTokenCache}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthError =
      error.response?.status === 401 || error.response?.status === 403;
    if (isAuthError && !originalRequest.retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest.retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token available");

        const { data } = await axios.post(`${baseURL}/auth/refresh-token`, {
          refreshToken,
        });

        await setItem("accessToken", data.accessToken);
        await setItem("refreshToken", data.refreshToken);
        accessTokenCache = data.accessToken;
        processQueue(null, data.accessToken);

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (err) {
        accessTokenCache = null;
        processQueue(err);
        authEventEmitter.emit("logout");
        failedQueue = [];
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  },
);
