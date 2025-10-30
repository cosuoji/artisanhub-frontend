import { Tab } from '@headlessui/react';
import { useAuthStore } from '../../store/useAuthStore';
import { useEffect, useState } from 'react';
import ArtisanPortfolioSection from '../panels/ArtisanPortfolioTab';
import ArtisanJobsPanel from '../panels/ArtisanJobsPanel';
import ArtisanReviewsPanel from '../panels/ArtisanReviewsPanel';
import clsx from 'clsx';
import ProfileTab from '../panels/ArtisanProfileTab';
import { AnimatePresence, motion } from 'framer-motion';
import ArtisanUpdateProfileTab from '../panels/ArtisanUpdateProfileTab';
import PerformanceStats from '../panels/ArtisanPerformance';
import ErrorBoundaryClass from '../ErrorBoundary';
import { Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ArtisanDashboard() {
  const { user, fetchUserData } = useAuthStore();
  const [profileTab, setProfileTab] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const profile = user?.artisanProfile;

  const tabs = ['Profile', 'Jobs', 'Reviews', 'Portfolio', 'Performance', 'Security'];

  useEffect(() => {
    fetchUserData();
  }, []);

  const isUnverified = user && !user.emailVerified;

  if (!user) {
    return (
      <div className="bg-white p-6 rounded shadow">
        <p>You haven’t completed your artisan profile yet.</p>
      </div>
    );
  }

  return (
    <Tab.Group selectedIndex={profileTab} onChange={setProfileTab}>
      {/* ---------- Top Bar Tabs (Responsive) ---------- */}
      <div className="relative mb-6 border-b">
        {isUnverified && (
  <div className="bg-amber-50 border border-amber-300 text-amber-800 p-3 rounded mb-4 text-sm flex items-center justify-between">
    <p>
      ⚠️ Your email is not verified. You must verify your email before updating your artisan profile.
    </p>
             <Link to="/resend-verification">
            {!user.isEmailVerified && <span>Resend Verification </span> }
            </Link>
  </div>
)}
        {/* Desktop Tabs */}
        <Tab.List className="hidden md:flex space-x-4">
          {tabs.map((tab) => (
            <Tab
              key={tab}
              className={({ selected }) =>
                clsx(
                  'px-4 py-2 text-sm font-medium border-b-2 transition-all',
                  selected
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-blue-600'
                )
              }
            >
              {tab}
            </Tab>
          ))}
        </Tab.List>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex justify-between items-center py-2">
          <h2 className="text-base font-semibold text-gray-700">
            {tabs[profileTab]}
          </h2>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded hover:bg-gray-100 transition"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Dropdown Menu (Mobile) */}
        {menuOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-t shadow-md z-10 md:hidden">
            {tabs.map((tab, i) => (
              <button
                key={tab}
                onClick={() => {
                  setProfileTab(i);
                  setMenuOpen(false);
                }}
                className={clsx(
                  'block w-full text-left px-4 py-2 text-sm border-b last:border-0',
                  i === profileTab ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-50'
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ---------- Tab Panels ---------- */}
      <Tab.Panels>
        <AnimatePresence mode="wait">
          <motion.div
            key={profileTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {
              [
                <ErrorBoundaryClass><ProfileTab key="profile" user={user} fetchUserData={fetchUserData} /></ErrorBoundaryClass>,
                <ErrorBoundaryClass><ArtisanJobsPanel key="jobs" /></ErrorBoundaryClass>,
                <ErrorBoundaryClass><ArtisanReviewsPanel key="reviews" /></ErrorBoundaryClass>,
                <ErrorBoundaryClass><ArtisanPortfolioSection key="portfolio" profile={user.artisanProfile} refreshProfile={fetchUserData} /></ErrorBoundaryClass>,
                <ErrorBoundaryClass><PerformanceStats key="performance" /></ErrorBoundaryClass>,
                <ErrorBoundaryClass><ArtisanUpdateProfileTab key="security" /></ErrorBoundaryClass>
              ][profileTab]
            }
          </motion.div>
        </AnimatePresence>
      </Tab.Panels>
    </Tab.Group>
  );
}
