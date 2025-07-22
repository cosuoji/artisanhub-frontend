import { useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useReviewStore } from '../store/reviewStore';
import { useAuthStore } from '../store/useAuthStore';

function Reviews({ artisanId }) {
  const {
    reviews,
    fetchReviews,
    loading,
    error,
    deleteMyReview,
    currentPage,
    totalPages,
  } = useReviewStore();

  const { user } = useAuthStore();


  useEffect(() => {
    fetchReviews(artisanId);
  }, [artisanId]);

  const handlePageChange = (page) => {
    fetchReviews(artisanId, page);
  };

  if (loading) return <div className="animate-pulse bg-gray-300 h-4 rounded w-3/4"></div>
  if (error) return <p className="text-red-500">{error}</p>;
  if (!reviews.length) return <p className="text-sm text-gray-500">No reviews yet.</p>;

  return (
    <div className="space-y-4 mt-8">
      <h3 className="text-lg font-semibold text-charcoal">User Reviews</h3>

      {reviews.map((review) => (
        <div key={review._id} className="border-b pb-3">
          <div className="flex items-center justify-between text-sm">
            <p className="font-semibold">{review.user?.name || 'Anonymous'}</p>
            <p className="text-yellow-500">
              {'⭐'.repeat(review.rating)}{' '}
              <span className="text-xs text-gray-500 ml-2">
                ({formatDistanceToNow(new Date(review.createdAt))} ago)
              </span>
            </p>
          </div>
          <p className="text-sm text-gray-700 mt-1">{review.comment}</p>

          {user?._id === review.user?._id && (
            <button
              onClick={() => deleteMyReview(review._id)}
              className="text-xs text-red-600 mt-2 hover:underline"
            >
              Delete Review
            </button>
          )}
        </div>
      ))}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-2 text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Reviews;
