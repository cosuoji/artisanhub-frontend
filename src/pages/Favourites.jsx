import { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';
import ArtisanCard from '../components/ArtisanCard';

export default function Favourites() {
  const [artisans, setArtisans] = useState([]);
  useEffect(() => {
    axiosInstance.get('/users/favourites').then(res => setArtisans(res.data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">My Favourites</h2>
      {artisans.length === 0 ? (
        <p className="text-gray-500">You haven’t favourited anyone yet.</p>
      ) : (
        <div className="grid gap-4">
          {artisans.map(a => <ArtisanCard key={a._id} artisan={a} />)}
        </div>
      )}
    </div>
  );
}
