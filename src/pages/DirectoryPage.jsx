import { useEffect, useRef, useState} from 'react';
import { useArtisanStore } from '../store/useArtisanStore';
import DirectoryFilters from '../components/DirectoryFilters';
import ArtisanMap from '../components/ArtisanMap';
import ArtisanMapList from '../components/ArtisanMapList';
import { useDebounce } from '../hooks/useDebounce';
import axiosInstance from '../api/axios';
import { usePagination } from '../hooks/usePagination';

export default function DirectoryPage() {
  const {
    artisans,
    loading,
    pagination,
    nearbyMode,
    fetchArtisans,
    fetchNearby,
    clearArtisans,
    fetchMapArtisans,
    mapArtisans,
    nearby
  } = useArtisanStore();

  const [locations, setLocations] = useState([]);
  const [locationError, setLocationError] = useState(null);
  const [mapCenter, setMapCenter] = useState([6.5244, 3.3792]);
  const listRef = useRef();
  const [currentPage, setCurrentPage] = useState(1);


  
const handlePageChange = (page) => {
  setCurrentPage(page);

  if (nearbyMode) {
    const { lat, lng, radius } = useArtisanStore.getState();

    fetchNearby(lat, lng, radius, {
      ...debouncedFilters,
      page,
    });
  } else {
    fetchArtisans(debouncedFilters, page);
  }

  setTimeout(() => {
    listRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, 100);
};



  
const { total = 0, totalPages = 1 } = pagination || {};
const { PageButtons } = usePagination({
  totalItems: total,
  perPage: 10,
  currentPage,
  onPageChange: handlePageChange,
});

  
 const [filters, setFilters] = useState({
  skill: '',
  location: '',
  minYears: '',
  onlyApproved: undefined,   // “don’t filter”
  availableOnly: undefined,
});

const debouncedFilters = useDebounce(filters, 500);


useEffect(() => {
  setCurrentPage(1); // reset to page 1 on filter change

  if (nearbyMode && mapCenter) {
    fetchMapArtisans({
      lat: mapCenter[0],
      lng: mapCenter[1],
      radius: 10,
      skill: debouncedFilters.skill,
      available: debouncedFilters.availableOnly,
    });

    fetchArtisans(
      { lat: mapCenter[0], lng: mapCenter[1], radius: 10, skill: debouncedFilters.skill, available: debouncedFilters.availableOnly },
      1
    );
  } else {
    fetchMapArtisans(debouncedFilters);
    fetchArtisans(debouncedFilters, 1);
  }
}, [debouncedFilters, nearbyMode, mapCenter]);


    const applyFilters = (customFilters = filters) => {
      const sanitized = {
        ...customFilters,
        skill: customFilters.skill ? customFilters.skill.toLowerCase() : '',
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
      onlyApproved: undefined,
      availableOnly: undefined,
    });
    setMapCenter([6.5244, 3.3792]);
  };
 

const locateMe = () => {
    if (!navigator.geolocation) {
      return alert('Geolocation not supported');
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        // pass *all* current filters into fetchNearby as `extra`
       fetchNearby(latitude, longitude, 5, debouncedFilters); // <- send all filters

        setMapCenter([latitude, longitude]);
        setTimeout(
          () => listRef.current?.scrollIntoView({ behavior: 'smooth' }),
          500
        );
      },
      () => alert('Failed to get location'),
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    axiosInstance.get('/locations')
      .then(res => setLocations(res.data.filter(loc => loc.isActive)))
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
      
       {nearbyMode ?  <ArtisanMap artisans={nearby} loading={loading} mapCenter={mapCenter}/> :  <ArtisanMap artisans={mapArtisans} loading={loading} mapCenter={mapCenter}/>}
    
      
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
       {nearbyMode ?  <ArtisanMapList artisans={nearby} loading={loading} /> :  <ArtisanMapList artisans={artisans} loading={loading} />}
        </div>
      {/* Pagination Controls */}
      <PageButtons />
     
    </div>
  );
}
