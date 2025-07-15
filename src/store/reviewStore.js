// src/store/reviewStore.js
import { create } from 'zustand';
import axiosInstance from '../api/axios';
import { toast } from 'react-hot-toast';

export const useReviewStore = create((set, get) => ({
    reviews: [],
    totalReviews: 0,
    totalPages: 1,
    currentPage: 1,
    loading: false,
    error: null,

    fetchReviews: async (artisanId, page = 1, limit = 5) => {
      set({ loading: true });
      try {
        const res = await axiosInstance.get(`/reviews/artisan/${artisanId}`, {
          params: { page, limit },
        });
        set({
          reviews: res.data.reviews,
          currentPage: res.data.page,
          totalPages: res.data.totalPages,
          loading: false,
        });
      } catch (err) {
        toast.error('Failed to fetch reviews');
        set({ loading: false });
      }
    },
    postReview: async (artisanId, rating, comment) => {
      set({ loading: true });
      try {
        const res = await axiosInstance.post('/reviews', {
          artisanId,
          rating,
          comment,
        });
        set((state) => ({
          reviews: [res.data.review, ...state.reviews],
        }));
        return true;
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to submit review');
        set({loading: false})
      }
    },

  deleteMyReview: async (id) => {
    try {
      await axiosInstance.delete(`/reviews/${id}`);
      toast.success('Review deleted');
      set({ reviews: get().reviews.filter(r => r._id !== id) });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete review');
    }
  },

  adminDeleteReview: async (id) => {
    try {
      await axiosInstance.delete(`/reviews/${id}/admin`);
      toast.success('Review removed by admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete review');
    }
  },
  fetchMyReviews: async (page = 1) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get(`/reviews/my-reviews?page=${page}&limit=10`);
      set({
        reviews: res.data.reviews,
        totalReviews: res.data.total,
        totalPages: res.data.totalPages,
        currentPage: res.data.page,
        loading: false,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch reviews');
      set({ loading: false });
    }
  },
  
}));
