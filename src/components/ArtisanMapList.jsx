import React, { useEffect } from 'react'
import { useArtisanStore } from '../store/useArtisanStore'
import { capitalizeWords } from '../utils/capitalize'
import { usePagination } from '../hooks/usePagination';



const ArtisanMapList = ({filters}) => {
  const {fetchArtisans, artisans, mapArtisans, pagination} = useArtisanStore()  
    const { PageButtons } = usePagination({
    totalItems: pagination.totalPages * 10,
     perPage: 10,
     currentPage: pagination.page,
     onPageChange: (p) => fetchArtisans(filters, p),
   });

    useEffect(() => {
      fetchArtisans(filters);
    }, [filters]);

 
  return (
    <div className="mt-6">
  <h2 className="text-lg font-semibold mb-4">Matching Artisans</h2>
  {artisans?.length === 0 ? (
    <p>No artisans found</p>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {mapArtisans?.map((artisan) => (
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
<PageButtons />

</div>
  )
}

export default ArtisanMapList