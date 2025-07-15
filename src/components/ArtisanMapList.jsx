import React, { useEffect } from 'react'
import { useArtisanStore } from '../store/useArtisanStore'
import { capitalizeWords } from '../utils/capitalize'


const ArtisanMapList = ({filters}) => {
  const {fetchArtisans, artisans} = useArtisanStore()  
    useEffect(() => {
      fetchArtisans();
    }, [filters]);

    const renderStars = (rating = 0) => {
      const full = Math.floor(rating), empty = 5 - full;
      return (
        <>
          {[...Array(full)].map((_, i) => <span key={i} className="text-yellow-400">★</span>)}
          {[...Array(empty)].map((_, i) => <span key={i} className="text-gray-300">★</span>)}
        </>
      );
    };
 
  return (
    <div className="mt-6">
  <h2 className="text-lg font-semibold mb-4">Matching Artisans</h2>
  {artisans?.length === 0 ? (
    <p>No artisans found</p>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {artisans?.map((artisan) => (
        <div key={artisan._id} className="border rounded p-4 bg-white shadow">
          <h3 className="font-semibold text-charcoal">{artisan.name}</h3>
          <p className="text-sm text-gray-600">{artisan.artisanProfile?.skills?.join(', ')}</p>
          <p className="text-xs text-gray-500">{capitalizeWords(artisan.artisanProfile?.location?.name)}</p>
          <a
            href={`/artisans/${artisan._id}`}
            className="text-blue-600 text-sm underline mt-2 inline-block"
          >
            View Profile
          </a>
          <div className="flex items-center">
          {renderStars(artisan.averageRating)}
          <span className="text-sm text-gray-500 ml-1">({artisan.reviewCount})</span>
        </div>
        </div>
      ))}
    </div>
  )}
</div>
  )
}

export default ArtisanMapList