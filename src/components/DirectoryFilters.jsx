import { useState, useEffect } from 'react';
import { capitalizeWords } from '../utils/capitalize';
import debounce from 'lodash.debounce';

export default function DirectoryFilters({
  filters,
  setFilters,
  locations,
  onApply,
  onReset,
  onLocateMe,
}) {
  const [locationSuggestions, setLocationSuggestions] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedFilters = {
      ...filters,
      [name]: name === 'skill' ? value.toLowerCase() : (type === 'checkbox' ? checked : value),
    };
    setFilters(updatedFilters);
    onApply(updatedFilters); // 🚀 Auto-apply after change
  };
  

  // Debounced autocomplete
  useEffect(() => {
    const run = debounce(() => {
      if (filters.location.length >= 2) {
        const matches = locations.filter((loc) =>
          loc.name.toLowerCase().includes(filters.location.toLowerCase())
        );
        setLocationSuggestions(matches);
      } else {
        setLocationSuggestions([]);
      }
    }, 250);
    run();
    return () => run.cancel();
  }, [filters.location, locations]);

  return (
    <div className="w-full md:w-1/3 bg-white p-4 rounded shadow space-y-4">
      <h2 className="text-lg font-semibold text-charcoal">Find an Artisan</h2>

      {/* Skill Input */}
      <input
        type="text"
        name="skill"
        placeholder="Skill (e.g. plumber)"
        className="border p-2 rounded w-full"
        value={filters.skill}
        onChange={handleChange}
      />

      {/* Location Autocomplete */}
      <div className="relative">
        <input
          type="text"
          name="location"
          placeholder="Location (e.g. Lekki)"
          className="border p-2 rounded w-full"
          value={filters.location}
          onChange={handleChange}
          autoComplete="off"
        />
        {locationSuggestions.length > 0 && (
          <ul className="absolute z-10 bg-white border w-full rounded shadow mt-1 max-h-40 overflow-y-auto">
            {locationSuggestions.map((loc) => (
              <li
                key={loc._id}
                className="px-3 py-1 hover:bg-gray-100 cursor-pointer"
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    location: capitalizeWords(loc.name),
                  }))
                }
              >
                {capitalizeWords(loc.name)}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Min Years of Experience */}
      <input
        type="number"
        name="minYears"
        placeholder="Min Years of Experience"
        className="border p-2 rounded w-full"
        value={filters.minYears}
        onChange={handleChange}
        min="0"
      />

      {/* Availability */}
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="availableOnly"
          checked={filters.availableOnly}
          onChange={handleChange}
        />
        Only Available Now
      </label>

      {/* Approval Status */}
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="onlyApproved"
          checked={filters.onlyApproved}
          onChange={handleChange}
        />
        Only Approved Artisans
      </label>

      {/* Buttons */}
      <div className="flex gap-2 pt-2">
        <button
          onClick={onLocateMe}
          className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
        >
          Nearby Me
        </button>
      </div>
    </div>
  );
}
