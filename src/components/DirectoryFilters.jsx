import { useState, useEffect, useMemo } from "react";
import { capitalizeWords } from "../utils/capitalize";
import { debounce } from "../utils/debounce";

export default function DirectoryFilters({
  filters: parentFilters,
  setFilters: setParentFilters,
  locations,
  onApply,
  onLocateMe,
  onReset,
}) {
  const [local, setLocal] = useState(parentFilters);
  const [locationSuggestions, setLocationSuggestions] = useState([]);

  useEffect(() => setLocal(parentFilters), [parentFilters]);

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

  const triggerSearch = useMemo(
    () => debounce((newFilters) => onApply(newFilters), 300),
    [onApply]
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const next = {
      ...local,
      [name]:
        name === "skill"
          ? value.toLowerCase()
          : type === "checkbox"
          ? checked
          : value,
    };
    setLocal(next);
    if (name === "location") fetchSuggestions(next.location);
    triggerSearch(next);
  };

  const pickSuggestion = (name) => {
    const next = { ...local, location: capitalizeWords(name) };
    setLocal(next);
    setLocationSuggestions([]);
    onApply(next);
  };

  const handleReset = () => {
    setLocal({
      skill: "",
      location: "",
      minYears: "",
      onlyApproved: false,
      availableOnly: false,
    });
    onReset?.();
  };

  return (
    <div className="sticky top-0 z-20 bg-white shadow-sm border-b border-gray-200 px-4 py-3">
      <div className="flex flex-wrap items-end gap-3">
        {/* Skill */}
        <div className="flex flex-col">
          <label className="text-xs font-medium text-gray-600 mb-1">Skill</label>
          <input
            type="text"
            name="skill"
            placeholder="e.g. plumber"
            className="border rounded-lg px-3 py-2 w-40 focus:ring-2 focus:ring-blue-400 outline-none"
            value={local.skill}
            onChange={handleChange}
          />
        </div>

        {/* Location with autocomplete */}
        <div className="flex flex-col relative">
          <label className="text-xs font-medium text-gray-600 mb-1">
            Location
          </label>
          <input
            type="text"
            name="location"
            placeholder="e.g. Lekki"
            className="border rounded-lg px-3 py-2 w-40 focus:ring-2 focus:ring-blue-400 outline-none"
            value={local.location}
            onChange={handleChange}
            onBlur={() => setTimeout(() => setLocationSuggestions([]), 100)}
            autoComplete="off"
          />
          {locationSuggestions.length > 0 && (
            <ul className="absolute top-16 left-0 z-30 bg-white border rounded-lg shadow-md w-40 max-h-40 overflow-y-auto">
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

        {/* Min Years */}
        <div className="flex flex-col">
          <label className="text-xs font-medium text-gray-600 mb-1">
            Min Years
          </label>
          <input
            type="number"
            name="minYears"
            placeholder="e.g. 2"
            className="border rounded-lg px-3 py-2 w-28 focus:ring-2 focus:ring-blue-400 outline-none"
            value={local.minYears}
            onChange={handleChange}
            min="0"
          />
        </div>

        {/* Available Only */}
        <label className="flex flex-col text-xs font-medium text-gray-600">
          <span className="mb-1">Available</span>
          <input
            type="checkbox"
            name="availableOnly"
            checked={local.availableOnly}
            onChange={handleChange}
            className="w-5 h-5 accent-green-600"
          />
        </label>

        {/* Approved Only */}
        <label className="flex flex-col text-xs font-medium text-gray-600">
          <span className="mb-1">Approved</span>
          <input
            type="checkbox"
            name="onlyApproved"
            checked={local.onlyApproved}
            onChange={handleChange}
            className="w-5 h-5 accent-blue-600"
          />
        </label>

        {/* Buttons */}
        <div className="flex items-end gap-2 ml-auto">
          <button
            onClick={onLocateMe}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
          >
            Nearby Me
          </button>
          <button
            onClick={handleReset}
            className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
