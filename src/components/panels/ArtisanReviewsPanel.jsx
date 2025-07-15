// src/components/dashboard/panels/ArtisanReviewPanel.jsx
import { useEffect } from 'react';
import { useReviewStore } from '../../store/reviewStore';
import { format } from 'date-fns';
import { useAuthStore } from '../../store/useAuthStore';

export default function ArtisanReviewPanel() {
  const { reviews, loading, fetchReviews, page, totalPages } = useReviewStore();
  const {user} = useAuthStore();


  useEffect(() => {
    fetchReviews(user?._id);
  }, []);


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
              <div key={review._id} className="bg-white p-4 rounded shadow border">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{review.user?.name || 'User'}</p>
                    <p className="text-gray-500 text-sm">
                      {format(new Date(review.createdAt), 'dd MMM yyyy')}
                    </p>
                  </div>
                  <span className="text-yellow-500 font-bold">{'★'.repeat(review.rating)}</span>
                </div>
                <p className="mt-2">{review.comment}</p>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex gap-2 mt-4">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => getMyReviews(i + 1)}
                  className={`px-3 py-1 border rounded ${
                    page === i + 1 ? 'bg-blue-600 text-white' : 'bg-white text-charcoal'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
