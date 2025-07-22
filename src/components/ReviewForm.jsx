import { useState,useEffect } from 'react';
import toast from 'react-hot-toast';
import { useReviewStore } from '../store/reviewStore';
import { useAuthStore } from '../store/useAuthStore';
import axiosInstance from '../api/axios';

export default function ReviewForm({ artisanId }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const { user } = useAuthStore();
  const { postReview } = useReviewStore();

  // ⭐ Show label for current selected stars
  const ratingLabels = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

  useEffect(() => {
    const checkEligibility = async () => {
      try {
        const res = await axiosInstance.get(`/jobs/can-review/${artisanId}`);
        setCanReview(res.data.canReview);
      } catch {
        setCanReview(false);
      }
    };

    if (user) {
      checkEligibility();
    }
  }, [user, artisanId]);

  if (!user) return <p className="text-sm text-gray-600 mt-4">Login to leave a review.</p>;
  if (!canReview) return <p className="text-sm text-gray-500 mt-4">You must complete a job with this artisan before leaving a review.</p>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !comment.trim()) {
      return toast.error('Rating and comment are required');
    }
  
    setSubmitting(true); // Only set submitting AFTER validation passes
  
    try {
      const res = await postReview(artisanId, rating, comment);
      if (res.success) {
        toast.success('Review submitted');
        setComment('');
        setRating(0);
      } else {
        if (res.message.includes('already reviewed')) {
          toast.error('You already left a review for this artisan.');
        } else {
          toast.error(res.message);
        }
      }
    } catch (error) {
    } finally {
      setSubmitting(false); // Ensure submitting is always reset
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 mt-6">
      <div>
        <label className="block text-sm mb-1 font-medium">Your Rating</label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setRating(star)}
              className={`cursor-pointer text-2xl ${
                star <= rating ? 'text-yellow-500' : 'text-gray-300'
              }`}
            >
              ⭐
            </span>
          ))}
          {rating > 0 && (
            <span className="text-sm text-gray-600 ml-2">
              ({ratingLabels[rating - 1]})
            </span>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm mb-1 font-medium">Comment</label>
        <textarea
          className="w-full border p-2 rounded"
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your thoughts..."
        />
      </div>

      <button
        type="submit"
        disabled={submitting || rating === 0}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}
