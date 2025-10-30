import { useEffect } from 'react';
import { useReviewStore } from '../store/reviewStore';
import { usePagination } from '../hooks/usePagination';
import ReviewCard from './ReviewCard';
import { useAuthStore } from '../store/useAuthStore';


export default function MyReviews() {
  const {
    reviews,
    fetchMyReviews,
    loading,
    currentPage,
    totalPages,
  } = useReviewStore();

  useEffect(() => {
    fetchMyReviews(1);
  }, []);

  const userId = useAuthStore().user._id

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      fetchMyReviews(page);
    }
  };

  const { PageButtons } = usePagination({
  totalItems: totalPages * 10, // simple proxy for total
     perPage: 10,
     currentPage,
     onPageChange: fetchMyReviews,
   });

  if (loading) return <div className="animate-pulse bg-gray-300 h-4 rounded w-3/4"></div>

  return (
    <section className="bg-white p-6 rounded-md shadow">
      <h2 className="text-lg font-semibold text-charcoal mb-4">My Reviews</h2>

      {reviews.length === 0 ? (
        <p className="text-gray-500">You haven’t submitted any reviews yet.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {reviews.map((review) => (
              <div>
                <ReviewCard review={review} userId={userId}/>
           </div>
            ))}
          </ul>

          {/* Pagination */}
          <PageButtons />
        </>
      )}
    </section>
  );
}
