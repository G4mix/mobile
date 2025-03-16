import axios, { AxiosInstance } from 'axios';
import { getToken, setToken } from './token';
import { authEventEmitter } from './authEventEmitter';
import { env } from './env';

const globalForAxios = globalThis as unknown as { axiosInstance?: AxiosInstance };

if (!globalForAxios.axiosInstance) {
  globalForAxios.axiosInstance = axios.create({
    baseURL: `${env.EXPO_PUBLIC_API_URL}/api/v1`,
  });
}

export const api = globalForAxios.axiosInstance;

let accessTokenCache: string | null = null;
let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void; reject: (error: any) => void }[] = [];

const processQueue = (error: any, token?: string) => {
  failedQueue.forEach(prom => {
    token ? prom.resolve(token) : prom.reject(error);
  });
  failedQueue = [];
};

api.interceptors.request.use(
  async (config: any) => {
    if (config.skipAuth) {
      return config;
    }

    if (!accessTokenCache) {
      accessTokenCache = await getToken('accessToken');
    }
    if (accessTokenCache) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${accessTokenCache}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await getToken('refreshToken');
        if (!refreshToken) throw new Error('No refresh token available');

        const { data } = await api.post('/auth/refresh-token', { refreshToken });

        await setToken('accessToken', data.accessToken);
        accessTokenCache = data.accessToken;
        processQueue(null, data.accessToken);

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (err) {
        accessTokenCache = null;
        processQueue(err);
        authEventEmitter.emit('logout');
        failedQueue = []
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    console.log(error)
    return Promise.reject(error);
  }
);