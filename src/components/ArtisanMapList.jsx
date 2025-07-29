import ArtisanCard from './ArtisanCard';



const ArtisanMapList = ({artisans, total, nearbyMode}) => {
 
  return (
    <div className="mt-6">
     {nearbyMode && <p className='px-10'>{total} artisans found in your area</p>}
  {artisans?.length === 0 ? (
    <p>No artisans found</p>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {artisans?.map((artisan) => (
        <div key={artisan._id} className="p-4 shadow">
          <ArtisanCard artisan={artisan} rating={artisan.artisanProfile.rating}/>
        </div>
      ))}
    </div>
  )}

</div>
  )
}

export default ArtisanMapList