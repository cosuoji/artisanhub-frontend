// src/components/dashboard/panels/ArtisanReviewPanel.jsx
import { useEffect } from 'react';
import { useReviewStore } from '../../store/reviewStore';
import { format } from 'date-fns';
import { useAuthStore } from '../../store/useAuthStore';
import { usePagination } from '../../hooks/usePagination';
import ReviewCard from '../ReviewCard';


export default function ArtisanReviewPanel() {
  const { reviews, loading, fetchReviews, page, totalPages } = useReviewStore();
  const {user} = useAuthStore();


  useEffect(() => {
    fetchReviews(user?._id);
  }, []);

    const { PageButtons } = usePagination({
    totalItems: totalPages * 10,
     perPage: 10,
     currentPage: page,
     onPageChange: (p) => fetchReviews(user?._id, p),
   });


  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-charcoal">My Reviews</h2>

      {loading ? (
        <p>Loading reviews...</p>
      ) : reviews?.length === 0 ? (
        <p className="text-gray-500">You haven't received any reviews yet.</p>
      ) : (
        <>
          <div className="space-y-4">
            {reviews?.map((review) => (  
                <ReviewCard review={review} />
            ))}
          </div>

          {/* Pagination */}
          <PageButtons />
        </>
      )}
    </div>
  );
}
