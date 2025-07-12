import { useEffect } from 'react';
import { useReviewStore } from '../store/reviewStore';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function MyReviews() {
  const {
    reviews,
    fetchMyReviews,
    deleteMyReview,
    loading,
    currentPage,
    totalPages,
  } = useReviewStore();

  useEffect(() => {
    fetchMyReviews(1);
  }, []);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      fetchMyReviews(page);
    }
  };


  if (loading) return <p>Loading reviews...</p>;

  return (
    <section className="bg-white p-6 rounded-md shadow">
      <h2 className="text-lg font-semibold text-charcoal mb-4">My Reviews</h2>

      {reviews.length === 0 ? (
        <p className="text-gray-500">You haven’t submitted any reviews yet.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {reviews.map((review) => (
              <li key={review._id} className="border p-4 rounded shadow-sm">
                <p className="text-sm text-gray-600">
                  Reviewed on {format(new Date(review.createdAt), 'dd MMM yyyy')}
                </p>
                <p className="mt-1">{review.comment}</p>
                <p className="text-yellow-600 text-sm">Rating: {review.rating} ★</p>

                {review.artisan && (
                  <p className="mt-1 text-sm">
                    For:{' '}
                    <Link
                      to={`/artisans/${review.artisan._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {review.artisan.name}
                    </Link>
                  </p>
                )}

                <button
                  onClick={() => deleteMyReview(review._id)}
                  className="text-red-600 hover:underline mt-2 text-sm"
                >
                  Delete Review
                </button>
              </li>
            ))}
          </ul>

          {/* Pagination */}
          <div className="flex items-center justify-center mt-6 gap-4">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </section>
  );
}
