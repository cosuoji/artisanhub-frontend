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
  // Only setup once
  if (axiosInstance.interceptors.response.handlers.length) return;

  axiosInstance.interceptors.response.use(
    response => response,
    async (error) => {
      const originalRequest = error.config;
      const url = new URL(originalRequest.url, window.location.origin).pathname;

      // Skip retry logic for specific cases
      if (originalRequest._shouldRetry === false || isPublicRoute(url)) {
        return Promise.reject(error);
      }

      // Handle 401 errors
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Mobile fallback: Check localStorage if cookies failed
          const isMobile = /Mobile|Android|iPhone/i.test(navigator.userAgent);
          const mobileRefreshToken = localStorage.getItem('mobile_refresh');
          
          if (isMobile && mobileRefreshToken) {
            // Use mobile fallback token
            const { data } = await axiosInstance.post('/auth/refresh', {
              refreshToken: mobileRefreshToken
            }, {
              _shouldRetry: false // Prevent infinite loops
            });

            // Update tokens in both storage mechanisms
            useAuthStore.getState().setTokens(data.accessToken, data.refreshToken);
            localStorage.setItem('mobile_access', data.accessToken);
            localStorage.setItem('mobile_refresh', data.refreshToken);
          } else {
            // Standard cookie-based refresh
            await useAuthStore.getState().refreshToken();
          }

          // Retry original request with new token
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          // Enhanced error handling
          console.error('Token refresh failed:', refreshError);
          
          // Clear all auth state
          await useAuthStore.getState().logout();
          
          // Mobile-specific cleanup
          if (/Mobile|Android|iPhone/i.test(navigator.userAgent)) {
            localStorage.removeItem('mobile_access');
            localStorage.removeItem('mobile_refresh');
          }

          // Redirect to login with error state
          if (window.location.pathname !== '/login') {
            window.location.href = `/login?error=session_expired`;
          }
          
          return Promise.reject(refreshError);
        }
      }

      // Handle other errors
      return Promise.reject(error);
    }
  );
};


if (!axiosInstance.interceptors.response.handlers.length)
setupAxiosInterceptor();

export { axiosInstance as default};
