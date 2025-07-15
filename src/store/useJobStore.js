// src/store/jobStore.js
import { create } from 'zustand';
import axiosInstance from '../api/axios';
import { toast } from 'react-hot-toast';

export const useJobStore = create((set, get) => ({
  jobs: [],
  artisanJobs: [],
  job: null,
  loading: false,
  totalJobs: 0,
  currentPage: 1,
  jobError: null,
  jobPage: 1,
  jobTotalPages: 1,


  fetchUserJobs: async (page = 1) => {
    set({ loading: true, jobError: null });
    try {
      const res = await axiosInstance.get(`/jobs?page=${page}&limit=10`);
      set({ jobs: res.data.jobs, totalJobs: res.data.total, currentPage: page, loading: false });
    } catch (err) {
      set({ jobError: err.response?.data?.message || 'Failed to load jobs', loading: false });
    }
  },

  fetchArtisanJobs: async (page = 1) => {
    set({ loading: true, jobError: null });
    try {
      const res = await axiosInstance.get(`/jobs/artisan?page=${page}&limit=10`);
      set({ artisanJobs: res.data.jobs, totalJobs: res.data.total, currentPage: page, loading: false });
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
      toast.success('Job deleted');
      set((state) => ({
        jobs: state.jobs.filter(j => j._id !== id),
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete job');
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
      get().fetchArtisanJobs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not complete job');
    }
  },

  fetchAllJobs: async (page = 1, status = '', startDate = '', endDate = '') => {
    set({ jobLoading: true });
  
    const query = new URLSearchParams({ page, limit: 10 });
    if (status) query.append('status', status);
    if (startDate) query.append('startDate', startDate);
    if (endDate) query.append('endDate', endDate);
  
    try {
      const res = await axiosInstance.get(`/jobs/admin/all?${query.toString()}`);
      set({
        jobs: res.data.jobs,
        jobLoading: false,
        jobPage: res.data.page,
        jobTotalPages: res.data.totalPages,
      });
    } catch (err) {
      toast.error('Failed to fetch jobs');
      set({ jobLoading: false });
    }
  }
,  
}));
