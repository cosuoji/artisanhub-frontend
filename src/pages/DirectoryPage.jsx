import { useEffect, useRef, useState } from 'react';
import { useArtisanStore } from '../store/useArtisanStore';
import DirectoryFilters from '../components/DirectoryFilters';
import ArtisanMap from '../components/ArtisanMap';
import ArtisanMapList from '../components/ArtisanMapList';
import { useDebounce } from '../hooks/useDebounce';
import axiosInstance from '../api/axios';

export default function DirectoryPage() {
  const {
    artisans, 
    loading, 
    pagination, 
    nearbyMode,
    mapArtisans,
    fetchArtisans, 
    fetchNearby, 
    fetchMapArtisans,  
    clearArtisans
  } = useArtisanStore();

  const [locations, setLocations] = useState([]);
  const [locationError, setLocationError] = useState(null);
  const [mapCenter, setMapCenter] = useState([6.5244, 3.3792]);
  const listRef = useRef();

  const [filters, setFilters] = useState({
    skill: '',
    location: '',
    minYears: '',
    onlyApproved: false,
    availableOnly: false,
  });

  const debouncedFilters = useDebounce(filters, 500);

  useEffect(() => {
    // Fetch filtered list with all filters
    fetchArtisans(debouncedFilters, 1);
    
    // Fetch map data with ONLY location filter
    fetchMapArtisans({ 
      location: debouncedFilters.location 
    });
  }, [debouncedFilters]);

  const applyFilters = (customFilters = filters) => {
    const sanitized = {
      ...customFilters,
      skill: customFilters.skill?.toLowerCase() || '',
      minYears: customFilters.minYears || '',
    };
    setFilters(sanitized);
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
    setMapCenter([6.5244, 3.3792]); // Reset to default center
  };

  const handlePageChange = (newPage) => fetchArtisans(filters, newPage);

  const locateMe = () => {
    if (!navigator.geolocation) return alert('Geolocation not supported');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        fetchNearby(latitude, longitude, 5);
        setMapCenter([latitude, longitude]);
        setTimeout(() => {
          listRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 500);
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
        <ArtisanMap
         artisans={mapArtisans}  
         mapCenter={mapCenter} // ⬅️ new
         loading={loading} 
          filters={debouncedFilters}
         nearbyMode={nearbyMode} />
        
      </div>

      {locationError && (
        <p className="text-sm text-red-600 mt-2 mb-4 px-4">{locationError}</p>
      )}

      {nearbyMode && (
        <div className="bg-blue-50 border border-blue-300 text-blue-700 px-4 py-2 rounded-md mt-4 mb-2 mx-4">
          Showing artisans near your location.
          <button
            onClick={resetFilters}
            className="ml-3 text-sm text-blue-600 underline"
          >
            Reset to full directory
          </button>
        </div>
      )}
    <div ref={listRef}>
      <ArtisanMapList
        artisans={artisans}
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
      />
      </div>
    </div>
  );
}
