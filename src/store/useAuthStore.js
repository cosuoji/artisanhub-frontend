import { create } from 'zustand';
import axiosInstance, { setupAxiosInterceptor } from '../api/axios';
import { toast } from 'react-hot-toast';

export const useAuthStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,
  _initialized: false,

  // Initialize auth system
  init: async () => {
    const store = get();
    if (store._initialized) return;

    setupAxiosInterceptor();
    try {
      await store.checkAuth();
    } catch {
      set({ user: null });
    }
    set({ _initialized: true });
  },

  // Check authentication state
  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      await get().fetchUserData();
    } catch {
      // Mobile fallback check
      if (this.isMobile() && localStorage.getItem('mobile_access')) {
        try {
          await get().refreshToken();
          await get().fetchUserData();
          return;
        } catch {
          // Fallback failed, proceed with logout
        }
      }
      set({ user: null });
    } finally {
      set({ checkingAuth: false });
    }
  },

  // Mobile detection helper
  isMobile: () => {
    return /Mobile|Android|iPhone/i.test(navigator.userAgent);
  },

  // Login with mobile fallback
  login: async (formData) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.post('/auth/login', formData, {
        withCredentials: true,
        _shouldRetry: false,
      });

      // Mobile fallback storage
      if (this.isMobile() && res.data?.tokens) {
        localStorage.setItem('mobile_access', res.data.tokens.accessToken);
        localStorage.setItem('mobile_refresh', res.data.tokens.refreshToken);
      }

      await get().fetchUserData();
      return true;
    } catch (err) {
      console.log(err.response.data)
      toast.error(err.response?.data || 'Login failed');
      return false;
    } finally {
      set({ loading: false });
    }
  },

  // Token management
  setTokens: (accessToken, refreshToken) => {
    // Update axios headers
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    
    // Mobile fallback
    if (this.isMobile()) {
      localStorage.setItem('mobile_access', accessToken);
      if (refreshToken) {
        localStorage.setItem('mobile_refresh', refreshToken);
      }
    }
  },

  // Enhanced refresh token with mobile support
  refreshToken: async () => {
    if (get().isRefreshing) return;
    get().isRefreshing = true;

    try {
      let res;
      const isMobile = this.isMobile();
      const mobileRefresh = localStorage.getItem('mobile_refresh');

      // Mobile fallback flow
      if (isMobile && mobileRefresh) {
        res = await axiosInstance.post('/auth/refresh', {
          refreshToken: mobileRefresh
        }, {
          _shouldRetry: false,
          withCredentials: false
        });
      } else {
        // Standard cookie flow
        res = await axiosInstance.post('/auth/refresh', {}, {
          withCredentials: true,
          _shouldRetry: false
        });
      }

      // Update tokens everywhere
      get().setTokens(res.data.accessToken, res.data.refreshToken);
      return res.data;
    } catch (err) {
      await get().logout();
      throw err;
    } finally {
      get().isRefreshing = false;
    }
  },

  // Enhanced logout with mobile cleanup
  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout', {}, {
        withCredentials: true
      });
    } catch (_) {}

    // Mobile cleanup
    if (this.isMobile()) {
      localStorage.removeItem('mobile_access');
      localStorage.removeItem('mobile_refresh');
    }

    // Clear everything
    delete axiosInstance.defaults.headers.common.Authorization;
    set({ user: null });
  },

  // Fetch user data with token fallback
  fetchUserData: async () => {
    try {
      // Add mobile token to header if needed
      if (this.isMobile() && !axiosInstance.defaults.headers.common.Authorization) {
        const mobileToken = localStorage.getItem('mobile_access');
        if (mobileToken) {
          axiosInstance.defaults.headers.common.Authorization = `Bearer ${mobileToken}`;
        }
      }

      const res = await axiosInstance.get('/auth/profile');
      set({ user: res.data });
      return res.data;
    } catch (err) {
      delete axiosInstance.defaults.headers.common.Authorization;
      throw err;
    }
  },

  refreshToken: async () => {
    try {
      const res = await axiosInstance.post('/auth/refresh-token', {}, { withCredentials: true });
      return res.data;
    } catch (err) {
      await get().logout(); // Clear everything
      throw err;
    }
  },
  

  resendVerification: async (email) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.post('/auth/resend-verification', { email });
      toast.success(res.data.message || 'Verification email sent!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend verification email');
    } finally {
      set({ loading: false });
    }
  },

  forgotPassword: async (email) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.post('/auth/forgot-password', { email });
      toast.success(res.data.message || 'Password reset link sent!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset link');
    } finally {
      set({ loading: false });
    }
  },
  updateProfile: async (data) => {
    try {
      const res = await axiosInstance.patch('/users/profile', data);
      toast.success('Profile updated');
      set({ user: res.data.user });
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
      return false;
    }
  },
  resetPassword: async (token, password) => {
    set({ loading: true });
    try {
      axiosInstance.post(`/auth/reset-password/${token}`, { password }, {
        withCredentials: true,
        _shouldRetry: false // ← prevent retry on this request
      });
      toast.success(res.data.message || 'Password reset successful!');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password reset failed');
      return false;
    } finally {
      set({ loading: false });
    }
  },
  verifyEmail: async (token) => {
    try {
      const res = await axiosInstance.get(`/auth/verify-email/${token}`, {
        withCredentials: true,
      });
      return { success: true, message: res.data?.message || 'Email verified!' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Verification failed.',
      };
    }
  },
}));
