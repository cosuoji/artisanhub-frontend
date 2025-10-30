import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";
import axiosInstance from "../api/axios";

export default function ReviewForm({ artisanId }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [jobId, setJobId] = useState("");
  const [jobs, setJobs] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuthStore();

  const ratingLabels = ["Poor", "Fair", "Good", "Very Good", "Excellent"];

  // ✅ Fetch unreviewed jobs
  useEffect(() => {
    const fetchUnreviewedJobs = async () => {
      try {
        const res = await axiosInstance.get(`/jobs/unreviewed/${artisanId}`);
        setJobs(res.data.jobs || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load jobs for review.");
      }
    };

    if (user && user._id !== artisanId) {
      fetchUnreviewedJobs();
    }
  }, [user, artisanId]);

  if (!user)
    return <p className="text-sm text-gray-600 mt-4">Login to leave a review.</p>;
  if (user._id === artisanId) return null;
  if (jobs.length === 0)
    return (
      <p className="text-sm text-gray-500 mt-4">
        You have no completed jobs available for review.
      </p>
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jobId) return toast.error("Please select a job to review.");
    if (!rating || !comment.trim())
      return toast.error("Rating and comment are required.");

    setSubmitting(true);
    try {
      await axiosInstance.post("/reviews", { artisanId, jobId, rating, comment });
      toast.success("Review submitted successfully!");
      setComment("");
      setRating(0);
      setJobId("");
      // Optionally remove reviewed job from dropdown
      setJobs(jobs.filter((job) => job._id !== jobId));
    } catch (error) {
      const message =
        error.response?.data?.message || "Error submitting review";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6 bg-white p-5 rounded-xl shadow-sm border">
      {/* Job Selection */}
      <div>
        <label className="block text-sm font-medium mb-1">Select Job</label>
        <select
          value={jobId}
          onChange={(e) => setJobId(e.target.value)}
          className="w-full border rounded p-2 text-sm"
        >
          <option value="">-- Choose a completed job --</option>
          {jobs.map((job) => (
            <option key={job._id} value={job._id}>
               {`${job.heading} from ${new Date(job.createdAt).toLocaleDateString()}`}
            </option>
          ))}
        </select>
      </div>

      {/* Rating */}
      <div>
        <label className="block text-sm mb-1 font-medium">Your Rating</label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setRating(star)}
              className={`cursor-pointer text-2xl ${
                star <= rating ? "text-yellow-500" : "text-gray-300"
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

      {/* Comment */}
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

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting || rating === 0}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}


