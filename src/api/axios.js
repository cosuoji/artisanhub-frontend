import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});



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
  // 1) REQUEST interceptor (new)
  axiosInstance.interceptors.request.use((cfg) => {
    const hasCookie = document.cookie.includes('accessToken=');
    if (!hasCookie) {
      const fb = localStorage.getItem('refreshToken');
      if (fb) cfg.headers['Authorization'] = `Bearer ${fb}`;
    }
    return cfg;
  });

  // 2) RESPONSE interceptor (your existing one)
  axiosInstance.interceptors.response.use(
    (res) => res,
    async (error) => {
      const originalRequest = error.config;
      const url = new URL(originalRequest.url, window.location.origin).pathname;

      if (originalRequest._shouldRetry === false) {
        return Promise.reject(error);
      }

      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !isPublicRoute(url)
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
if (!axiosInstance.interceptors.response.handlers.length)
setupAxiosInterceptor();

export { axiosInstance as default};
