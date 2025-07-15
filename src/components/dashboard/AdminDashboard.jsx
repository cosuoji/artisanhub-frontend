// src/components/dashboard/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import AnalyticsPanel from '../panels/AnalyticsPanel';
import UsersPanel from '../panels/UsersPanel';
import JobsPanel from '../panels/JobsPanel';
import LocationsPanel from '../panels/LocationsPanel';

const tabs = ['Analytics', 'Users', 'Job Management', 'Locations'];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('Analytics');

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-4 font-medium ${
              activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Analytics' && <AnalyticsPanel />}
      {activeTab === 'Users' && <UsersPanel />}
      {activeTab === 'Job Management'  && <JobsPanel />}
      {activeTab === 'Locations' && <LocationsPanel />}

    </div>
  );
}
