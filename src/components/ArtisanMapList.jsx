import React, { useEffect } from 'react'
import { useArtisanStore } from '../store/useArtisanStore'
import { capitalizeWords } from '../utils/capitalize'



const ArtisanMapList = ({filters}) => {
  const {fetchArtisans, artisans, pagination} = useArtisanStore()  
    useEffect(() => {
      fetchArtisans();
    }, [filters]);


    const handlePageChange = (page) => {
      fetchArtisans(filters, page);
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
          <p className="text-xs text-gray-500">{capitalizeWords(artisan?.artisanProfile?.location?.name || "")}</p>
          <a
            href={`/artisans/${artisan._id}`}
            className="text-blue-600 text-sm underline mt-2 inline-block"
          >
            View Profile
          </a>
        </div>
      ))}
    </div>
  )}
  <div className="flex justify-center gap-2 mt-4">
  {Array.from({ length: pagination.totalPages }, (_, i) => (
    <button
      key={i}
      onClick={() => handlePageChange(i + 1)}
      className={`px-3 py-1 rounded border ${
        pagination.page === i + 1 ? 'bg-blue-600 text-white' : 'bg-white'
      }`}
    >
      {i + 1}
    </button>
  ))}
</div>

</div>
  )
}

export default ArtisanMapList