// src/components/dashboard/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import AnalyticsPanel from '../panels/AnalyticsPanel';
import UsersPanel from '../panels/UsersPanel';
import JobsPanel from '../panels/JobsPanel';
import LocationsPanel from '../panels/LocationsPanel';
import ErrorBoundaryClass from '../ErrorBoundary';


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

      {activeTab === 'Analytics' && <ErrorBoundaryClass><AnalyticsPanel /></ErrorBoundaryClass>}
      {activeTab === 'Users' && <ErrorBoundaryClass><UsersPanel /></ErrorBoundaryClass>}
      {activeTab === 'Job Management'  && <ErrorBoundaryClass><JobsPanel /></ErrorBoundaryClass>}
      {activeTab === 'Locations' && <ErrorBoundaryClass><LocationsPanel /></ErrorBoundaryClass>}

    </div>
  );
}
