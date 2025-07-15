import { create } from 'zustand';
import axiosInstance from '../api/axios';
import { toast } from 'react-hot-toast';

export const useAdminStore = create((set, get) => ({
  loading: false,
  stats: null,
  users: [],
  totalUsers: 0,
  analytics: null,
  page: 1,
  totalPages: 1,
  search: '',

  fetchAnalytics: async () => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get('/admin/analytics');
      set({ analytics: res.data, loading: false });
    } catch (err) {
      toast.error('Failed to load analytics');
      set({ loading: false });
    }
  },

  fetchUsers: async (page = 1, search = '') => {
    set({ loading: true, page, search });
    try {
      const res = await axiosInstance.get(`/admin/users?page=${page}&search=${search}`);
      set({
        users: res.data.users,
        totalPages: res.data.totalPages || 1,
        loading: false,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch users');
      set({ loading: false });
    }
  },


  banUser: async (id) => {
    try {
      await axiosInstance.patch(`/admin/users/${id}/ban`);
      toast.success('User banned');
      get().fetchUsers(get().page, get().search);
    } catch (err) {
      toast.error('Failed to ban user');
    }
  },

  deleteUser: async (id, hard = false) => {
    try {
      await axiosInstance.delete(`/admin/users/${id}?hard=${hard}`);
      toast.success(hard ? 'User permanently deleted' : 'User soft-deleted');    
      get().fetchUsers(get().page, get().search);
    } catch (err) {
      toast.error('Failed to delete user');
    }
  },

  approveArtisan: async (artisanId) => {
    try {
      await axiosInstance.patch(`/admin/artisans/${artisanId}/approve`);
      toast.success('Artisan approved');
      get().fetchUsers(get().page, get().search);
    } catch (err) {
      toast.error('Failed to approve artisan');
    }
  },
restoreUser: async (id) => {
  try {
    await axiosInstance.patch(`/admin/users/${id}/restore`);
    toast.success('User restored');
    const updated = get().users.map((u) => u._id === id ? { ...u, isDeleted: false } : u);
    set({ users: updated });
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to restore user');
  }
},

}));
