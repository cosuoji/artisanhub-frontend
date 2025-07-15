import { useEffect, useState } from 'react';
import { useArtisanStore } from '../store/useArtisanStore';
import DirectoryFilters from '../components/DirectoryFilters';
import ArtisanMap from '../components/ArtisanMap';
import ArtisanMapList from '../components/ArtisanMapList';

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
  const [locations, setLocations] = useState([]);

  const applyFilters = () => fetchArtisans(filters);


  const resetFilters = () => {
    clearArtisans();
    setFilters({
      skill: '',
      location: '',
      minYears: '',
      onlyApproved: false,
      availableOnly: false,
    });
    fetchArtisans(); // 👈 re-fetch all artisans immediately
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
