import { useEffect, useState } from 'react';
import axiosInstance from '../../api/axios';
import toast from 'react-hot-toast';
import { capitalizeWords } from '../../utils/capitalize';

const ITEMS_PER_PAGE = 10;

export default function LocationsPanel() {
  const [locations, setLocations] = useState([]);
  const [name, setName] = useState('');
  const [state, setState] = useState('Lagos');
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [activePage, setActivePage] = useState(1);
  const [inactivePage, setInactivePage] = useState(1);

  const fetchLocations = async () => {
    try {
      const res = await axiosInstance.get('/locations');
      setLocations(res.data);
    } catch {
      toast.error('Failed to load locations');
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleCreate = async () => {
    if (!name.trim()) return toast.error('Name is required');

    setLoading(true);
    try {
      await axiosInstance.post('/locations', { name, state });
      toast.success('Location added');
      setName('');
      fetchLocations();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create location');
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id) => {
    try {
      await axiosInstance.patch(`/locations/${id}/toggle`);
      toast.success('Status updated');
      fetchLocations();
    } catch {
      toast.error('Toggle failed');
    }
  };

  const filtered = locations.filter(loc =>
    loc.name.toLowerCase().includes(search.toLowerCase()) ||
    loc.state.toLowerCase().includes(search.toLowerCase())
  );

  const activeLocations = filtered.filter(loc => loc.isActive);
  const inactiveLocations = filtered.filter(loc => !loc.isActive);

  const paginate = (data, page) => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return data.slice(start, start + ITEMS_PER_PAGE);
  };

  const totalPages = (count) => Math.ceil(count / ITEMS_PER_PAGE);

  const renderTable = (title, data, page, setPage) => (
    <div className="overflow-x-auto mt-6">
      <h3 className="text-lg font-semibold text-charcoal mb-2">{title}</h3>
      <table className="min-w-full text-sm border">
        <thead>
          <tr className="text-left border-b">
            <th className="p-2">Name</th>
            <th className="p-2">State</th>
            <th className="p-2">Coordinates</th>
            <th className="p-2">Active?</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>

            
          {paginate(data, page).map(loc => (
            <tr key={loc._id} className="border-b">
              <td className="p-2">{capitalizeWords(loc.name)}</td>
              <td className="p-2">{capitalizeWords(loc.state)}</td>
              <td className="p-2 text-xs">
                [{loc.coordinates?.coordinates?.[0]}, {loc.coordinates?.coordinates?.[1]}]
              </td>
              <td className="p-2">{loc.isActive ? '✅' : '❌'}</td>
              <td className="p-2">
                <button
                  onClick={() => toggleActive(loc._id)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Toggle
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages(data.length) > 1 && (
        <div className="mt-3 flex gap-2 items-center text-sm">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages(data.length)}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages(data.length)}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );

  return (
    <section className="bg-white p-6 rounded shadow space-y-6">
      <h2 className="text-xl font-semibold text-charcoal">Manage Locations</h2>

      {/* Create Form */}
      <div className="flex gap-3 items-end">
        <div>
          <label className="block text-sm">City Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded w-48"
            placeholder="e.g. Lekki"
          />
        </div>

        <div>
          <label className="block text-sm">State</label>
          <input
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="border p-2 rounded w-48"
          />
        </div>

        <button
          onClick={handleCreate}
          disabled={loading}
          className="bg-emerald-600 text-white px-4 py-2 rounded"
        >
          {loading ? 'Adding...' : 'Add Location'}
        </button>
      </div>

      {/* Search Filter */}
      <div className="mt-2">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setActivePage(1);
            setInactivePage(1);
          }}
          placeholder="Search by city or state..."
          className="border p-2 rounded w-full sm:w-64"
        />
      </div>

      {/* Tables */}
      {renderTable('✅ Active Locations', activeLocations, activePage, setActivePage)}
      {inactiveLocations.length > 0 &&
        renderTable('❌ Inactive Locations', inactiveLocations, inactivePage, setInactivePage)}
    </section>
  );
}
