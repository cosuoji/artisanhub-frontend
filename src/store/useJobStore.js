// src/store/jobStore.js
import { create } from 'zustand';
import axiosInstance from '../api/axios';
import { toast } from 'react-hot-toast';

export const useJobStore = create((set, get) => ({
  jobs: [],
  job: null,
  loading: false,
  totalJobs: 0,
  currentPage: 1,
  jobError: null,

  fetchUserJobs: async (page = 1) => {
    set({ loading: true, jobError: null });
    try {
      const res = await axios.get(`/jobs?page=${page}&limit=10`);
      set({ jobs: res.data.jobs, totalJobs: res.data.total, currentPage: page, loading: false });
    } catch (err) {
      set({ jobError: err.response?.data?.message || 'Failed to load jobs', loading: false });
    }
  },

  fetchJobById: async (id) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get(`/jobs/${id}`);
      set({ job: res.data, loading: false });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Job not found');
      set({ loading: false });
    }
  },

  createJob: async (data) => {
    try {
      const res = await axiosInstance.post('/jobs', data);
      toast.success('Job created');
      get().fetchUserJobs(); // refresh
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create job');
    }
  },

  cancelJob: async (id) => {
    try {
      await axiosInstance.delete(`/jobs/${id}`);
      toast.success('Job cancelled');
      set({ jobs: get().jobs.filter(j => j._id !== id) });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel job');
    }
  },

  updateJobStatus: async (id, status) => {
    try {
      const res = await axiosInstance.patch(`/jobs/${id}/status`, { status });
      toast.success('Status updated');
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  },

  markJobCompleted: async (id) => {
    try {
      await axiosInstance.patch(`/jobs/${id}/complete`);
      toast.success('Job marked as completed');
      get().fetchUserJobs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not complete job');
    }
  },

  fetchAllJobs: async () => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get('/jobs/admin/all');
      set({ jobs: res.data, loading: false });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch all jobs');
      set({ loading: false });
    }
  },
}));
