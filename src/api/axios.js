import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const publicRoutes = [
  '/',
  '/login',
  '/signup',
  '/directory',
  '/reset-password/:token',
  '/forgot-password',
  '/verify-email/:token',
  '/resend-verification',
  '/auth/refresh-token',
  '/auth/reset-password',
];

const isPublicRoute = (url) => {
  return publicRoutes.some((route) => {
    const regex = new RegExp('^' + route.replace(/:\w+/g, '[^/]+') + '$');
    return regex.test(url);
  });
};

export const setupAxiosInterceptor = () => {
  axiosInstance.interceptors.response.use(
    res => res,
    async (error) => {
      const originalRequest = error.config;

      // Prevent retry if:
      // 1. Already retried once
      // 2. It's a public route like /login, /signup etc.
      const url = new URL(originalRequest.url, axiosInstance.defaults.baseURL).pathname;

      const isPublic = publicRoutes.some(route =>
        new RegExp('^' + route.replace(/:\w+/g, '[^/]+') + '$').test(url)
      );

      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !isPublic
      ) {
        originalRequest._retry = true;

        try {
          await useAuthStore.getState().refreshToken();
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          await useAuthStore.getState().logout();
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};


export { axiosInstance as default};
