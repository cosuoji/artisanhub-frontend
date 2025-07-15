import { useEffect, useState } from 'react';
import { useArtisanStore } from '../store/useArtisanStore';
import DirectoryFilters from '../components/DirectoryFilters';
import ArtisanMap from '../components/ArtisanMap';
import ArtisanMapList from '../components/ArtisanMapList';
import { useDebounce } from '../hooks/useDebounce';
import axiosInstance from '../api/axios';


export default function DirectoryPage() {
  const {
    artisans, loading, pagination, nearbyMode,
    fetchArtisans, fetchNearby, clearArtisans
  } = useArtisanStore();

  const [filters, setFilters] = useState({
    skill: '',
    location: '',
    minYears: '',
    onlyApproved: false,
    availableOnly: false,
  });

  useEffect(() => { fetchArtisans(filters, 1); }, []);
  const debouncedFilters = useDebounce(filters, 500); // 👈 debounce here

    // Auto fetch when debounced filters change (and reset to page 1)
    useEffect(() => {
      fetchArtisans({ ...debouncedFilters }, 1);
    }, [debouncedFilters]);

  const [locations, setLocations] = useState([]);

  const applyFilters = (customFilters = filters) => {
    const sanitized = {
      ...customFilters,
      skill: customFilters.skill?.toLowerCase() || '',
    };
    fetchArtisans(sanitized);
  };


  const resetFilters = () => {
    clearArtisans();
    setFilters({
      skill: '',
      location: '',
      minYears: '',
      onlyApproved: false,
      availableOnly: false,
    });
    fetchArtisans({}, 1); // ✅ fetch all artisans on reset
   };

  const handlePageChange = (newPage) => fetchArtisans(filters, newPage);

  
  const locateMe = () => {
    if (!navigator.geolocation) return alert('Geolocation not supported');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        fetchNearby(latitude, longitude, 10); // radius = 10km
      },
      () => alert('Failed to get location'),
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    axiosInstance.get('/locations')
      .then((res) => setLocations(res.data.filter(loc => loc.isActive)))
      .catch(() => {});
  }, []);

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-6">
      <DirectoryFilters
          filters={filters}
          setFilters={setFilters}
          locations={locations}
          onApply={applyFilters}
          onReset={resetFilters}
          onLocateMe={locateMe}
        />
        <ArtisanMap artisans={artisans} loading={loading} nearbyMode={nearbyMode} />
      </div>

      <ArtisanMapList
        artisans={artisans}
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
