// src/store/useAuthStore.js
import { create } from 'zustand';
import axiosInstance, { setupAxiosInterceptor } from '../api/axios';
import { toast } from 'react-hot-toast';

const publicRoutes = ['/', '/login', '/signup', '/directory'];

let isRefreshing = false;

export const useAuthStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,
  _initialized: false,

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

  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      await get().fetchUserData();
    } catch {
      set({ user: null });
    } finally {
      set({ checkingAuth: false });
    }
  },

  login: async (formData) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.post('/auth/login', formData, {
        withCredentials: true,
        _shouldRetry: false,
      });
  
      await get().fetchUserData();
      set({ loading: false });
      return true;
  
    } catch (err) {
      set({ loading: false });
      toast.error(err.response?.data?.message || 'Login failed');
      return false;
    }
  },
  

  signup: async (formData) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.post('/auth/signup', formData, { withCredentials: true });
    
      try {
        await new Promise(res => setTimeout(res, 1000))
        await get().fetchUserData(); // try to fetch profile
        await axios.get('/test-cookies', { withCredentials: true });
      } catch (err) {
        console.warn("⚠️ Failed to fetch user after signup");
        //toast.error("You are signed up, but authentication failed. Please log in.");
        return false;
      }
        set({ loading: false });
      return true;
    } catch (err) {
      //toast.error(err.response?.data?.message || 'Signup failed');
      set({ loading: false });
      return false;
    }
  },
  
  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (_) {}

    set({ user: null });
  },

  fetchUserData: async () => {
    try {
      const res = await axiosInstance.get('/auth/profile', { withCredentials: true });
      set({ user: res.data });
    } catch (err) {
      set({ user: null });
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
