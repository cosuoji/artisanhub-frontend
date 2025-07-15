import { useEffect, useState } from 'react';
import { useJobStore } from '../../store/useJobStore';
import JobDetailsModal from '../panels/JobDetailsModal';

export default function JobsPanel() {
  const {
    jobs,
    jobLoading,
    fetchAllJobs,
    cancelJob,
    jobPage,
    markJobCompleted,
    jobTotalPages,

  } = useJobStore();

  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    fetchAllJobs();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchAllJobs(1, status, startDate, endDate);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <form onSubmit={handleFilter} className="flex flex-wrap gap-3">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border px-3 py-2 rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Filter
        </button>
      </form>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3">User</th>
              <th className="p-3">Artisan</th>
              <th className="p-3">Status</th>
              <th className="p-3">Created</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobLoading ? (
              <tr>
                <td colSpan="5" className="p-4">Loading jobs...</td>
              </tr>
            ) : jobs.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-4 text-gray-500">No jobs found.</td>
              </tr>
            ) : (
              jobs.map((job) => (
                <tr key={job._id} className="border-b">
                  <td className="p-3">{job.user?.name || 'Unknown'}</td>
                  <td className="p-3">{job.artisan?.name || 'Unassigned'}</td>
                  <td className="p-3 capitalize">
                    <span className={`text-sm font-medium px-2 py-1 rounded 
                      ${job.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        job.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-700'}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="p-3">{new Date(job.createdAt).toLocaleDateString()}</td>
                  <td className="p-3 space-y-1 flex flex-col gap-1">
                    <button
                      onClick={() => setSelectedJob(job)}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </button>
                    <button
                      onClick={() => cancelJob(job._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                    {job.status !== 'completed' && (
                      <button
                        onClick={() => markJobCompleted(job._id)}
                        className="text-green-700 hover:underline"
                      >
                        Mark Completed
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {jobTotalPages > 1 && (
        <div className="flex gap-2 mt-4 flex-wrap">
          {[...Array(jobTotalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => fetchAllJobs(i + 1, status, startDate, endDate)}
              className={`px-3 py-1 border rounded ${
                jobPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-white text-charcoal'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Job Details Modal */}
      {selectedJob && (
        <JobDetailsModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </div>
  );
}