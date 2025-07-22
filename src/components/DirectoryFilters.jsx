import { useState, useEffect, useMemo } from 'react';
import { capitalizeWords } from '../utils/capitalize';
import { debounce } from '../utils/debounce';

export default function DirectoryFilters({
  filters: parentFilters,
  setFilters: setParentFilters,
  locations,
  onApply,
  onLocateMe,
}) {
  /* 1. Local state for instant UI feedback */
  const [local, setLocal] = useState(parentFilters);
  const [locationSuggestions, setLocationSuggestions] = useState([]);

  /* 2. Keep local & parent in sync when parent changes (e.g. reset) */
  useEffect(() => setLocal(parentFilters), [parentFilters]);

  /* 3. Debounce suggestion list (≥ 2 chars) */
  const fetchSuggestions = useMemo(
    () =>
      debounce((q) => {
        if (q.length >= 2) {
          const matches = locations.filter((loc) =>
            loc.name.toLowerCase().includes(q.toLowerCase())
          );
          setLocationSuggestions(matches);
        } else {
          setLocationSuggestions([]);
        }
      }, 250),
    [locations]
  );

  /* 4. Debounce the real search (300 ms after last keystroke) */
  const triggerSearch = useMemo(
    () => debounce((newFilters) => onApply(newFilters), 300),
    [onApply]
  );

  /* 5. Handle every keystroke locally */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const next = {
      ...local,
      [name]: name === 'skill' ? value.toLowerCase() : type === 'checkbox' ? checked : value,
    };
    setLocal(next);                       // instant UI
    if (name === 'location') fetchSuggestions(next.location);
    triggerSearch(next);                  // debounced apply
  };

  /* 6. Pick suggestion immediately */
  const pickSuggestion = (name) => {
    const next = { ...local, location: capitalizeWords(name) };
    setLocal(next);
    setLocationSuggestions([]);
    onApply(next);                        // fire right away
  };

  return (
    <div className="w-full md:w-1/3 bg-white p-4 rounded shadow space-y-4">
      <h2 className="text-lg font-semibold text-charcoal">Find an Artisan</h2>

      <input
        type="text"
        name="skill"
        placeholder="Skill (e.g. plumber)"
        className="border p-2 rounded w-full"
        value={local.skill}
        onChange={handleChange}
      />

      {/* Location Autocomplete */}
      <div className="relative">
        <input
          type="text"
          name="location"
          placeholder="Location (e.g. Lekki)"
          className="border p-2 rounded w-full"
          value={local.location}
          onChange={handleChange}
          onBlur={() => setTimeout(() => setLocationSuggestions([]), 100)}
          autoComplete="off"
        />
        {locationSuggestions.length > 0 && (
          <ul className="absolute z-10 bg-white border w-full rounded shadow mt-1 max-h-40 overflow-y-auto">
            {locationSuggestions.map((loc) => (
              <li
                key={loc._id}
                className="px-3 py-1 hover:bg-gray-100 cursor-pointer"
                onMouseDown={() => pickSuggestion(loc.name)}
              >
                {capitalizeWords(loc.name)}
              </li>
            ))}
          </ul>
        )}
      </div>

      <input
        type="number"
        name="minYears"
        placeholder="Min Years of Experience"
        className="border p-2 rounded w-full"
        value={local.minYears}
        onChange={handleChange}
        min="0"
      />

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="availableOnly"
          checked={local.availableOnly}
          onChange={handleChange}
        />
        Only Available Now
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="onlyApproved"
          checked={local.onlyApproved}
          onChange={handleChange}
        />
        Only Approved Artisans
      </label>

      <button
        onClick={onLocateMe}
        className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
      >
        Nearby Me
      </button>

      
    </div>
  );
}