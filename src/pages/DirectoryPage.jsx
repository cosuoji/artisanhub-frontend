import { useEffect, useRef, useState } from "react";
import { useArtisanStore } from "../store/useArtisanStore";
import DirectoryFilters from "../components/DirectoryFilters";
import ArtisanMapList from "../components/ArtisanMapList";
import { useDebounce } from "../hooks/useDebounce";
import axiosInstance from "../api/axios";
import { usePagination } from "../hooks/usePagination";
import SEO from "../components/SEO";
SEO

export default function DirectoryPage() {
  const {
    artisans,
    loading,
    pagination,
    nearbyMode,
    fetchArtisans,
    fetchNearby,
    clearArtisans,
    nearby,
  } = useArtisanStore();

  const [locations, setLocations] = useState([]);
  const [locationError, setLocationError] = useState(null);
  const listRef = useRef();
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState({
    skill: "",
    location: "",
    minYears: "",
    onlyApproved: undefined,
    availableOnly: undefined,
  });

  useEffect(() => {
  if (nearbyMode) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          fetchNearby(latitude, longitude, 5, debouncedFilters);
        },
        (err) => setLocationError("Failed to get location"),
        { enableHighAccuracy: true }
      );
    } else {
      setLocationError("Geolocation not supported");
    }
  } else {
    fetchArtisans(debouncedFilters, 1);
  }
}, []);


  const debouncedFilters = useDebounce(filters, 500);

  const handlePageChange = (page) => {
    setCurrentPage(page);

    if (nearbyMode) {
      const { lat, lng, radius } = useArtisanStore.getState();
      fetchNearby(lat, lng, radius, { ...debouncedFilters, page });
    } else {
      fetchArtisans(debouncedFilters, page);
    }

    setTimeout(() => {
      listRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const { total = 0 } = pagination || {};
  const { PageButtons } = usePagination({
    totalItems: total,
    perPage: 10,
    currentPage,
    onPageChange: handlePageChange,
  });

  useEffect(() => {
    setCurrentPage(1);
    if (nearbyMode) {
      const { lat, lng } = useArtisanStore.getState();
      fetchNearby(lat, lng, 5, debouncedFilters);
    } else {
      fetchArtisans(debouncedFilters, 1);
    }
  }, [debouncedFilters, nearbyMode]);

  const applyFilters = (customFilters = filters) => {
    const sanitized = {
      ...customFilters,
      skill: customFilters.skill ? customFilters.skill.toLowerCase() : "",
      minYears: customFilters.minYears || "",
    };
    setFilters(sanitized);
  };

  const resetFilters = () => {
    clearArtisans();
    setFilters({
      skill: "",
      location: "",
      minYears: "",
      onlyApproved: undefined,
      availableOnly: undefined,
    });
  };

  const locateMe = () => {
    if (!navigator.geolocation) {
      return alert("Geolocation not supported");
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        fetchNearby(latitude, longitude, 5, debouncedFilters);
        setTimeout(
          () => listRef.current?.scrollIntoView({ behavior: "smooth" }),
          500
        );
      },
      () => alert("Failed to get location"),
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    axiosInstance
      .get("/locations")
      .then((res) => setLocations(res.data.filter((loc) => loc.isActive)))
      .catch(() => {});
  }, []);

  return (
    <div className="px-4">
      <SEO title="Directory Page" description="Find Artisans in Lagos for any job"/>
      {/* Filters at top (horizontal) */}
      <div className="mb-6">
        <DirectoryFilters
          filters={filters}
          setFilters={setFilters}
          locations={locations}
          onApply={applyFilters}
          onReset={resetFilters}
          onLocateMe={locateMe}
        />
      </div>

      {locationError && (
        <p className="text-sm text-red-600 mt-2 mb-4">{locationError}</p>
      )}

      {nearbyMode && (
        <div className="bg-blue-50 border border-blue-300 text-blue-700 px-4 py-2 rounded-md mt-4 mb-2">
          Showing artisans near your location.
          <button
            onClick={resetFilters}
            className="ml-3 text-sm text-blue-600 underline"
          >
            Reset to full directory
          </button>
        </div>
      )}

      {/* Artisan Cards */}
      <div ref={listRef}>
        <ArtisanMapList
          artisans={nearbyMode ? nearby : artisans}
          loading={loading}
        />
      </div>

      {/* Pagination */}
      <PageButtons />
    </div>
  );
}
