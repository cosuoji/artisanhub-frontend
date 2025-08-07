import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { capitalizeWords } from '../utils/capitalize';
import { useArtisanStore } from '../store/useArtisanStore';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import Reviews from '../components/ArtisanReviews';
import ReviewForm from '../components/ReviewForm';
import ContactModal from '../components/ContactModal';
import BookingModal from '../components/BookingModal';
import { useReviewStore } from '../store/reviewStore';
import FavouriteButton from '../components/FavoriteButton';
import ShareButton from '../components/ShareButton';
import FloatingChat from '../components/FloatingChat';
import { useAuthStore } from '../store/useAuthStore';



export default function ArtisanProfilePage() {
  const { id } = useParams();
  const { user } = useAuthStore()

  const {loading,fetchArtisan, artisan} = useArtisanStore();
  const [showContact, setShowContact] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const {
    reviews,
    fetchReviews,
  } = useReviewStore();

  useEffect(() => {
    fetchArtisan(id);
  }, [id]);

    useEffect(() => {
      fetchReviews(id);
    }, [id]);

  if (loading) return <div className="animate-pulse bg-gray-300 h-4 rounded w-3/4"></div>
  if (!artisan) return <p className="p-6 text-red-500">Artisan not found</p>;

  const {
    fullName,
    avatar,
    artisanProfile,
    email,
    phone,
    isArtisan,
  } = artisan;

  const { bio, skills,address, yearsOfExperience, totalJobsCompleted } = artisanProfile || {};
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow space-y-6">
      {/* Profile Header */}
      <div className="flex items-center gap-4">
        <img
          src={avatar || '/default-avatar.png'}
          alt={fullName}
          className="w-20 h-20 rounded-full object-cover"
        />
        <div>
          <h1 className="text-xl font-bold text-charcoal">{artisan?.name}</h1>
          <p className="text-sm text-gray-600 capitalize">{skills?.[0]}</p>
          <p className="text-sm">{yearsOfExperience} yrs experience</p>
        </div>

      </div>

      {/* Ratings */}
      <div className="text-sm flex gap-2 items-center">
      {reviews.length > 0 && (
  <span className="text-sm text-yellow-600 font-medium">
    ⭐ Average Rating:{" "}
    {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)} / 5
  </span>
)}
        <span>({reviews?.length || 0} reviews)</span>
      </div>

        <div>
              {/* CTA Buttons */}

        <ContactModal
            isOpen={showContact}
            onClose={() => setShowContact(false)}
            phone={phone}
            email={email}
            address={address}
            />        

      <div className="flex gap-4">
        <button 
        onClick={() => setShowContact(true)}
        className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700">
         Contact Me
        </button>

        <BookingModal
        aria-modal="true" role="dialog"
            artisanId={artisan._id}
            isOpen={showBooking}
            onClose={() => setShowBooking(false)}
            />


        <button 
         onClick={() => setShowBooking(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Book Now
        </button>
        <div className='flex gap-4'>
          <ShareButton artisanId={id}/>
        </div>
        <div className='flex gap-4'>
          <FavouriteButton artisanId={artisan._id} />
        </div>
      </div>

      </div>
      {/* Bio & Skills */}
      <div>
        <h2 className="font-semibold">About</h2>
        <p className="text-sm text-gray-700 mt-1">{bio || 'No bio provided'}</p>

        <div className="flex gap-2 mt-3 flex-wrap">
          {skills?.map(skill => (
            <span
              key={skill}
              className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Location */}
      <div>
        <h2 className="font-semibold">Location</h2>
         <p className="text-sm">{capitalizeWords(artisan?.artisanProfile?.location?.name || "Not Specified") || 'Not specified'}</p> 
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500">Jobs Completed</p>
          <p className="text-lg font-bold">{totalJobsCompleted || 0}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Availability</p>
          <p className="text-lg font-bold">{artisanProfile?.available ? '✅ Available' : '❌ Unavailable'}</p>
        </div>
      </div>

      {/* Portfolio Section */}
      <PhotoProvider>
        <div className="grid grid-cols-2 gap-4">
            {artisanProfile?.portfolioImages.map((img, i) => (
            <PhotoView key={i} src={img}>
                <img src={img} alt="Portfolio" className="w-full h-60 object-cover rounded" />
            </PhotoView>
            ))}
        </div>
        </PhotoProvider>

       {/* Reviews Section */}
        <div>
        <h3 className="text-lg font-semibold text-charcoal mb-2">Reviews</h3>
        <Reviews artisanId={id} />
        <ReviewForm artisanId={id} />

        </div> 

     {user && <FloatingChat artisanId={id} />}

    </div>
  );
}
