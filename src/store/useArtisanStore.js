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
  nearby: [],
  lat: null,
  lng: null,
  radius: null,


// useArtisanStore.js
// useArtisanStore.js
fetchArtisans: async (filters = {}, page = 1) => {
  set({ loading: true });
  try {
    const res = await axiosInstance.get('/artisans', {
      params: { page, limit: 10, ...filters, skill: filters.skill || undefined },
    });

    set({
      artisans: res.data.artisans,
      pagination: {
        page,
        total: res.data.total,
        totalPages: res.data.totalPages
      },
      loading: false
    });
  } catch {
    set({ loading: false }); // ← critical
  }
},

fetchMapArtisans: async (filters = {}) => {
  const params = { mapOnly: true, ...filters, skill: filters.skill || undefined };
  const res = await axiosInstance.get('/artisans', { params });
  set({ mapArtisans: res.data.artisans });
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
// useArtisanStore.js
// store/useArtisanStore.js
fetchNearby: async (lat, lng, radius = 5, extra = {}) => {
  set({ loading: true, artisansError: null });

  const params = new URLSearchParams({
    lat,
    lng,
    radius,
    page: extra.page || 1,
    limit: extra.limit || 10,
    ...(extra.skill && { skill: extra.skill }),
    ...(extra.availableOnly !== undefined && { available: extra.availableOnly }),
    ...(extra.onlyApproved !== undefined && { onlyApproved: extra.onlyApproved }),
  });

  try {
    const res = await axiosInstance.get(`/artisans/nearby?${params}`);
    set({
      lat,
      lng,
      radius,
      nearby: res.data.artisans,
      artisans: res.data.artisans,
      pagination: {
        page: extra.page || 1,
        total: res.data.total,
        totalPages: res.data.totalPages,
      },
      nearbyMode: true,
      loading: false,
    });
  } catch (err) {
    set({ nearby: [], artisans: [], loading: false });
  }
},



  clearArtisans: () => set({
    artisans: [],
    artisansError: null,
    loading: false,
    lastFilters: null,
    nearbyMode: false,
    pagination: { page: 1, totalPages: 1 },
     mapArtisans: [], // ✅ clear map
    
  }),
}));