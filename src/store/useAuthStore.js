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

         // --- NEW TEST CODE ---
    const isMobileSafari =
      /iP(hone|od|ad)/.test(navigator.userAgent) &&
      /Safari/.test(navigator.userAgent) &&
      !/Chrome/.test(navigator.userAgent);

    await new Promise(r => setTimeout(r, 300)); // small delay so browser can set cookie
    const hasCookie = document.cookie.includes('refreshToken=');
    if (isMobileSafari && !hasCookie && res.data.refreshToken) {
      localStorage.setItem('refreshToken', res.data.refreshToken);
    }
  
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

  // Helper to wait for a cookie to exist
  const waitForCookie = async (name, timeout = 5000) => {
    const start = Date.now();
    while (!document.cookie.includes(`${name}=`)) {
      if (Date.now() - start > timeout) throw new Error('Cookie not set in time');
      await new Promise(r => setTimeout(r, 100)); // poll every 100ms
    }
  };

  try {
    const res = await axiosInstance.post('/auth/signup', formData, { withCredentials: true });

    // Detect Mobile Safari
    const isMobileSafari =
      /iP(hone|od|ad)/.test(navigator.userAgent) &&
      /Safari/.test(navigator.userAgent) &&
      !/Chrome/.test(navigator.userAgent);

    // Wait for the refreshToken cookie to appear (desktop or supported browsers)
    try {
      await waitForCookie('refreshToken', 5000);
    } catch (err) {
      // If cookie didn't set in time and it's Mobile Safari, fallback to localStorage
      if (isMobileSafari && res.data.refreshToken) {
        localStorage.setItem('refreshToken', res.data.refreshToken);
      } else {
        throw err; // for other browsers, fail if cookie isn't set
      }
    }

    // Now fetch the user data
    await get().fetchUserData();

    set({ loading: false });
    return true;
  } catch (err) {
    toast.error(err.response?.data?.message || err.message || 'Signup failed');
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
    // mobile Safari fallback
    const fallbackToken = localStorage.getItem('refreshToken');
    if (fallbackToken) {
      await axiosInstance.post(
        '/auth/refresh-token',
        {},
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${fallbackToken}` },
        }
      );
    } else {
      await axiosInstance.post(
        '/auth/refresh-token',
        {},
        { withCredentials: true }
      );
    }
  } catch (err) {
    localStorage.removeItem('refreshToken');
    await get().logout();
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
  completeArtisanSignup: async (data) => {
  const ok = await get().signup({
    name: data.name,
    email: data.email,
    password: data.password,
    confirmPassword: data.confirmPassword,
    role: 'artisan'
  });
  if (!ok) return false;
  await axiosInstance.put('/artisans/me/profile', {
    phone: data.phone,
    bio: data.bio,
    skills: data.skills.split(',').map(s => s.trim()),
    yearsOfExperience: data.yearsOfExperience,
    address: data.address,
    location: data.location,
  });
  return true;
}

}));
