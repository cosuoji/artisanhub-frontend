import { useEffect, useState } from 'react';
import axiosInstance from '../../api/axios';
import { MdWork, MdStar, MdRateReview, MdAccessTime } from 'react-icons/md';

export default function PerformanceStats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axiosInstance.get('/artisans/me/stats')
      .then(res => setStats(res.data))
      .catch(() => console.error('Failed to load stats'));
  }, []);

  if (!stats) return <p>Loading stats...</p>;

  return (
    <div className="grid sm:grid-cols-2 gap-6">
      <div className="p-4 bg-white rounded shadow flex items-center gap-3">
        <MdWork size={28} className="text-blue-600" />
        <div>
          <p className="text-gray-500 text-sm">Jobs Completed</p>
          <p className="text-xl font-semibold">{stats.totalJobs}</p>
        </div>
      </div>
      <div className="p-4 bg-white rounded shadow flex items-center gap-3">
        <MdStar size={28} className="text-yellow-500" />
        <div>
          <p className="text-gray-500 text-sm">Average Rating</p>
          <p className="text-xl font-semibold">{stats.averageRating}</p>
        </div>
      </div>
      <div className="p-4 bg-white rounded shadow flex items-center gap-3">
        <MdRateReview size={28} className="text-emerald-600" />
        <div>
          <p className="text-gray-500 text-sm">Reviews</p>
          <p className="text-xl font-semibold">{stats.reviewCount}</p>
        </div>
      </div>
      <div className="p-4 bg-white rounded shadow flex items-center gap-3">
        <MdAccessTime size={28} className="text-purple-600" />
        <div>
          <p className="text-gray-500 text-sm">Availability</p>
          <p className="text-xl font-semibold">
            {stats.available ? 'Available' : 'Unavailable'}
          </p>
        </div>
      </div>
    </div>
  );
}
