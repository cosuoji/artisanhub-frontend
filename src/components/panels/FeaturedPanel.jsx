import { useEffect, useState } from 'react';
import { useAdminStore } from '../../store/adminStore';
import { usePagination } from '../../hooks/usePagination';

export default function FeaturedPanel() {
  const {
    featuredArtisans,
    fetchFeaturedArtisans,
    toggleFeatureArtisan,
    loading,
    page,
    totalPages,
  } = useAdminStore();

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchFeaturedArtisans(1, searchQuery);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFeaturedArtisans(1, searchQuery);
  };

  const { PageButtons } = usePagination({
    totalItems: totalPages * 10,
    perPage: 10,
    currentPage: page,
    onPageChange: (p) => fetchFeaturedArtisans(p, searchQuery),
  });

  const durations = [
    { label: '7 days', value: 7 },
    { label: '30 days', value: 30 },
    { label: '90 days', value: 90 },
  ];

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center gap-2">
        <input
          type="text"
          placeholder="Search artisan..."
          className="border px-3 py-2 rounded w-full md:w-1/3"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left min-w-[600px]">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Featured Until</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className="p-4">Loading featured artisans...</td></tr>
            ) : featuredArtisans.length === 0 ? (
              <tr><td colSpan="4" className="p-4">No featured artisans.</td></tr>
            ) : (
              featuredArtisans.map((artisan) => (
                <tr key={artisan._id} className="border-b">
                  <td className="p-3">{artisan.name}</td>
                  <td className="p-3">{artisan.email}</td>
                  <td className="p-3">
                    {artisan.artisanProfile?.featuredUntil
                      ? new Date(artisan.artisanProfile.featuredUntil).toLocaleDateString()
                      : 'Not Featured'}
                  </td>
                  <td className="p-3 space-x-2">
                    <select
                      className="border rounded px-2 py-1"
                      onChange={(e) =>
                        toggleFeatureArtisan(artisan._id, parseInt(e.target.value))
                      }
                    >
                      <option value="">Set Duration</option>
                      {durations.map((d) => (
                        <option key={d.value} value={d.value}>{d.label}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => toggleFeatureArtisan(artisan._id, 0)}
                      className="text-red-600 hover:underline"
                    >
                      Unfeature
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <PageButtons />
    </div>
  );
}
