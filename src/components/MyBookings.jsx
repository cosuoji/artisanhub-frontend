import { useEffect } from 'react';
import { useJobStore } from '../store/useJobStore';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { usePagination } from '../hooks/usePagination';


function MyBookings() {
  const { jobs, fetchUserJobs, cancelJob, loading, totalJobs, currentPage } = useJobStore();

  useEffect(() => {
    fetchUserJobs(1);
  }, []);

  const { PageButtons } = usePagination({
     totalItems: totalJobs,
     perPage: 10,
     currentPage,
     onPageChange: fetchUserJobs,
});

  
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="animate-pulse bg-gray-300 h-4 rounded w-3/4"></div>


  return (
    <section className="bg-white p-6 rounded-md shadow">
      <h2 className="text-lg font-semibold text-charcoal mb-4">My Bookings</h2>

      {jobs.length === 0 ? (
        <p className="text-gray-500">You have no bookings yet.</p>
      ) : (
        <>
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {jobs.map((job) => (
              <div key={job._id} className="min-w-[300px] border p-4 rounded shadow-sm bg-gray-50">
                <p><strong>Title:</strong> {job.title}</p>
                <p><strong>Description:</strong> {job.description}</p>

                {/* Status Badge */}
                <p className="mt-2">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium rounded ${getStatusColor(
                      job.status
                    )}`}
                  >
                    {job.status}
                  </span>
                </p>

                {/* Creation Date */}
                <p className="text-xs text-gray-500 mt-1">
                  Created on: {format(new Date(job.createdAt), 'dd MMM yyyy')}
                </p>

                {/* Artisan Link */}
                {job.artisan && (
                  <p className="mt-2">
                    <Link
                      to={`/artisans/${job.artisan._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View Artisan: {job.artisan.name}
                    </Link>
                  </p>
                )}

                {/* Cancel Button */}
                <button
                  onClick={() => cancelJob(job._id)}
                  className="text-red-600 hover:underline mt-2 text-sm"
                >
                  Cancel
                </button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <PageButtons />
        </>
      )}
    </section>
  );
}

export default MyBookings;