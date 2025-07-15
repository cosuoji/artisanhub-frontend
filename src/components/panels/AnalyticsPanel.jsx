// src/components/dashboard/panels/AnalyticsPanel.jsx
import { useEffect } from 'react';
import { useAdminStore } from '../../store/adminStore';

export default function AnalyticsPanel() {
  const { analytics, fetchAnalytics } = useAdminStore();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (!analytics) return <p className="text-gray-600">Loading analytics...</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {Object.entries(analytics).map(([key, value]) => (
        <div key={key} className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
          <p className="text-2xl font-bold text-charcoal">{value}</p>
        </div>
      ))}
    </div>
  );
}
