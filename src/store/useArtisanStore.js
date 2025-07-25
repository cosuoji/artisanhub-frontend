import { create } from 'zustand';
import axiosInstance from '../api/axios';

export const useArtisanStore = create((set) => ({
  artisans: [],
  loading: false,
  artisansError: null,
  lastFilters: null,
  nearbyMode: false,
  pagination: { page: 1, totalPages: 1 },
  artisan: null,
  locations: [],
  mapArtisans: [],

  // Fetch for list view (with full filtering)
  fetchArtisans: async (filters = {}, page = 1) => {
    set({ loading: true, artisansError: null });
    try {
      const params = {
        ...filters,
        page,
        limit: 10,
      };
      const res = await axiosInstance.get('/artisans', { params });
   
      set({
        artisans: res.data.artisans,
        pagination: { 
          page: res.data.page, 
          totalPages: res.data.totalPages 
        },
        lastFilters: filters,
        nearbyMode: false,
        loading: false,
      });
    } catch (err) {
      set({
        artisans: [],
        artisansError: err.response?.data?.message || 'Failed to load artisans',
        loading: false,
      });
    }
  },

  // Fetch for map view (only location filter + coordinates)
  fetchMapArtisans: async (filters = {}) => {
    try {
      const res = await axiosInstance.get('/artisans/map', { 
        params: {
          // Only pass location filter to map endpoint
          location: filters.location 
        }
      });
      set({
        mapArtisans: res.data.artisans,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching map artisans:", error);
      set({
        mapArtisans: [],
        loading: false,
      });
    }
  },

  // Existing methods remain unchanged
  fetchArtisan: async (id) => {
    set({ loading: true, artisansError: null });
    try {
      const res = await axiosInstance.get(`/artisans/${id}`);
      set({
        artisan: res.data,
        loading: false,
      });
    } catch (err) {
      set({
        artisansError: err.response?.data?.message || 'Failed to load artisan',
        loading: false,
      });    
    }
  },

  fetchNearby: async (lat, lng, radius = 10) => {
    set({ loading: true, artisansError: null });
    try {
      const res = await axiosInstance.get('/artisans/nearby', { 
        params: { lat, lng, radius } 
      });
      set({
        artisans: res.data.artisans,
        nearbyMode: true,
        pagination: { page: 1, totalPages: 1 },
        loading: false,
      });
    } catch (err) {
      set({
        artisansError: err.response?.data?.message || 'Failed to fetch nearby artisans',
        loading: false,
      });
    }
  },

  clearArtisans: () => set({
    artisans: [],
    artisansError: null,
    loading: false,
    lastFilters: null,
    nearbyMode: false,
    pagination: { page: 1, totalPages: 1 },
  }),
}));