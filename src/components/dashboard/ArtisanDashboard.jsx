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



export default function ArtisanDashboard() {
  const { user, fetchUserData } = useAuthStore();
  const [profileTab, setProfileTab] = useState(0);
  const profile = user?.artisanProfile;

  useEffect(() => {
    fetchUserData();
  }, []);


  if (!user || !profile) {
    return (
      <div className="bg-white p-6 rounded shadow">
        <p>You haven’t completed your artisan profile yet.</p>
      </div>
    );
  }

  return (
    <Tab.Group selectedIndex={profileTab} onChange={setProfileTab}>
      <Tab.List className="flex space-x-4 border-b mb-6">
        {['Profile', 'Jobs', 'Reviews', 'Portfolio', "Performance",'Security'].map((tab) => (
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

      <Tab.Panels>
  <AnimatePresence mode="wait">
    <motion.div
      key={profileTab} // trigger re-animation on tab change
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      {
        [
          <ProfileTab key="profile" user={user} fetchUserData={fetchUserData} />,
          <ArtisanJobsPanel key="jobs" />,
          <ArtisanReviewsPanel key="reviews" />,
          <ArtisanPortfolioSection key="portfolio" profile={user.artisanProfile} refreshProfile={fetchUserData} />,
          <PerformanceStats key="performance" />,
          <ArtisanUpdateProfileTab key="security"/>
        ][profileTab]
      }
    </motion.div>
  </AnimatePresence>
</Tab.Panels>

    </Tab.Group>
  );
}
