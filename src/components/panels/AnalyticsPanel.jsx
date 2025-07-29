// src/components/dashboard/panels/AnalyticsPanel.jsx
import { useEffect } from 'react';
import { useAdminStore } from '../../store/adminStore';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];


export default function AnalyticsPanel() {
  const { analytics, fetchAnalytics } = useAdminStore();

  useEffect(() => {
    fetchAnalytics();
  }, []);


  if (!analytics) return <p className="text-gray-600">Loading analytics...</p>;


const barData = [
  { name: 'Users', value: analytics.totalUsers },
  { name: 'Artisans', value: analytics.totalArtisans },
  { name: 'Jobs', value: analytics.totalJobs },
  { name: 'Reviews', value: analytics.totalReviews },
];

const pieData = [
  { name: 'Pending Jobs', value: analytics.pendingJobs },
  { name: 'Completed Jobs', value: analytics.completedJobs },
];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-charcoal">Admin Analytics</h2>

      {/* Bar chart */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={barData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#1E3A8A" />
        </BarChart>
      </ResponsiveContainer>

      {/* Pie chart */}
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );

}
