import { useEffect, useState } from 'react';
import { useAdminStore } from '../../store/adminStore';
import { usePagination } from '../../hooks/usePagination';

export default function UsersPanel() {
  const {
    users,
    loading,
    fetchUsers,
    banUser,
    deleteUser,
    approveArtisan,
    restoreUser,
    page,
    totalPages,
  } = useAdminStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    fetchUsers(1, searchQuery, roleFilter, statusFilter, sortBy, sortOrder);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(1, searchQuery, roleFilter, statusFilter, sortBy, sortOrder);
  };

  const handleFilterChange = () => {
    fetchUsers(1, searchQuery, roleFilter, statusFilter, sortBy, sortOrder);
  };

  const { PageButtons } = usePagination({
    totalItems: totalPages * 10,
    perPage: 10,
    currentPage: page,
    onPageChange: (p) => fetchUsers(p, searchQuery, roleFilter, statusFilter, sortBy, sortOrder),
  });

  return (
    <div className="space-y-4">
      {/* Filters & Search */}
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center gap-2">
        <input
          type="text"
          placeholder="Search by name or ID..."
          className="border px-3 py-2 rounded w-full md:w-1/3"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); handleFilterChange(); }}
          className="border rounded px-3 py-2"
        >
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="artisan">Artisan</option>
          <option value="admin">Admin</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); handleFilterChange(); }}
          className="border rounded px-3 py-2"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="banned">Banned</option>
          <option value="deleted">Deleted</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => { setSortBy(e.target.value); handleFilterChange(); }}
          className="border rounded px-3 py-2"
        >
          <option value="name">Sort by Name</option>
          <option value="email">Sort by Email</option>
          <option value="role">Sort by Role</option>
          <option value="status">Sort by Status</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => { setSortOrder(e.target.value); handleFilterChange(); }}
          className="border rounded px-3 py-2"
        >
          <option value="asc">Asc</option>
          <option value="desc">Desc</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm text-left min-w-[600px]">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="p-4" colSpan="5">Loading users...</td></tr>
            ) : users.length === 0 ? (
              <tr><td className="p-4" colSpan="5">No users found.</td></tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="border-b">
                  <td className="p-3">{user.name || 'Unnamed'}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3 capitalize">{user.role}</td>
                  <td className="p-3">
                    {user.isBanned ? (
                      <span className="text-red-600">Banned</span>
                    ) : user.isDeleted ? (
                      <span className="text-yellow-600">Deleted</span>
                    ) : (
                      <span className="text-green-600">Active</span>
                    )}
                    {user.role === 'artisan' && user.artisanProfile?.isVerified && (
                      <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-1 rounded">Verified</span>
                    )}
                  </td>
                  <td className="p-3 space-x-2">
                    {!user.isBanned && !user.isDeleted && (
                      <button onClick={() => banUser(user._id)} className="text-red-600 hover:underline">Ban</button>
                    )}
                    {!user.isDeleted && (
                      <>
                        <button onClick={() => deleteUser(user._id, false)} className="text-yellow-600 hover:underline">Soft Delete</button>
                        <button onClick={() => deleteUser(user._id, true)} className="text-red-800 hover:underline">Hard Delete</button>
                      </>
                    )}
                    {user.isDeleted && (
                      <button onClick={() => restoreUser(user._id)} className="text-green-600 hover:underline">Restore</button>
                    )}
                    {user.role === 'artisan' && !user.artisanProfile?.isVerified && (
                      <button onClick={() => approveArtisan(user._id)} className="text-blue-600 hover:underline">Approve Artisan</button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {loading ? (
          <p className="text-center text-gray-600">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="text-center text-gray-600">No users found.</p>
        ) : (
          users.map((user) => (
            <div key={user._id} className="border rounded-md p-4 shadow-sm bg-white">
              <p className="font-semibold text-charcoal">{user.name || 'Unnamed'}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-600 capitalize">Role: {user.role}</p>
              <p className="text-sm">
                Status:{' '}
                {user.isBanned ? (
                  <span className="text-red-600 font-medium">Banned</span>
                ) : user.isDeleted ? (
                  <span className="text-yellow-600 font-medium">Deleted</span>
                ) : (
                  <span className="text-green-600 font-medium">Active</span>
                )}
                {user.role === 'artisan' && user.artisanProfile?.isVerified && (
                  <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-1 rounded">Verified</span>
                )}
              </p>

              <div className="mt-3 flex flex-wrap gap-2 text-sm">
                {!user.isBanned && !user.isDeleted && (
                  <button onClick={() => banUser(user._id)} className="text-red-600 underline">Ban</button>
                )}
                {!user.isDeleted && (
                  <>
                    <button onClick={() => deleteUser(user._id, false)} className="text-yellow-600 underline">Soft Delete</button>
                    <button onClick={() => deleteUser(user._id, true)} className="text-red-800 underline">Hard Delete</button>
                  </>
                )}
                {user.isDeleted && (
                  <button onClick={() => restoreUser(user._id)} className="text-green-600 underline">Restore</button>
                )}
                {user.role === 'artisan' && !user.artisanProfile?.isVerified && (
                  <button onClick={() => approveArtisan(user._id)} className="text-blue-600 underline">Approve</button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <PageButtons />
    </div>
  );
}