// src/components/dashboard/panels/ArtisanJobPanel.jsx
import { useEffect, useState } from 'react';
import { useJobStore } from '../../store/useJobStore';
import JobDetailModal from './JobDetailsModal';
import { format } from 'date-fns';

export default function ArtisanJobPanel() {
  const { artisanJobs, fetchArtisanJobs, markJobCompleted, jobLoading } = useJobStore();
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    fetchArtisanJobs(); // for artisan this returns jobs assigned to them
  }, []);

  if (jobLoading) return <p className="p-6 text-charcoal">Loading your jobs...</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-charcoal">My Assigned Jobs</h2>

      {artisanJobs.length === 0 ? (
        <p className="text-gray-500">You have no assigned jobs yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {artisanJobs.map((job) => (
            <div
              key={job._id}
              className="bg-white p-4 rounded shadow border flex flex-col justify-between"
            >
              <div>
                <p className="text-sm text-gray-600 mt-1">{job.description}</p>
                <p className="text-sm mt-2">
                  <span className="font-medium">Date:</span>{' '}
                  {format(new Date(job.createdAt), 'dd MMM yyyy')}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Status:</span>{' '}
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs ${
                      job.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : job.status === 'in-progress'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {job.status}
                  </span>
                </p>
              </div>

              <div className="mt-3 flex gap-2 flex-wrap">
                <button
                  onClick={() => setSelectedJob(job)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  View Details
                </button>
                {job.status !== 'completed' && (
                  <button
                    onClick={() => markJobCompleted(job._id)}
                    className="text-green-600 hover:underline text-sm"
                  >
                    Mark as Completed
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedJob && (
        <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </div>
  );
}
