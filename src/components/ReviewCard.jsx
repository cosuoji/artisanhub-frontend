import { Star, Briefcase } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

export default function ReviewCard({ review }) {
  const { user, rating, comment, job, createdAt } = review;
  const signInUser = useAuthStore().user
  const formattedDate = new Date(createdAt).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  

  return (
    <div className="bg-white border rounded-xl shadow-sm p-5 transition hover:shadow-md">
      {/* Header: Reviewer + Rating */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <img
            src={
              user?.avatar || signInUser?.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                user?.name || "User"
              )}`
            }
            alt={user?.name}
            className="w-10 h-10 rounded-full object-cover border"
          />
          <div>
            <p className="font-medium text-gray-800">{user?.name || signInUser.name || "Anonymous"}</p>
            <p className="text-xs text-gray-500">{formattedDate}</p>
          </div>
        </div>

        {/* Rating Stars */}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={16}
              className={star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
            />
          ))}
        </div>
      </div>

      {/* Comment */}
      {comment ? (
        <p className="text-gray-700 text-sm leading-relaxed">{comment}</p>
      ) : (
        <p className="text-gray-400 text-sm italic">No written comment provided.</p>
      )}

      {/* Job Reference */}
      {job && (
        <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-100 px-3 py-2 rounded-lg">
          <Briefcase size={14} className="text-blue-500" />
          <span>
            Reviewed for job:{" "}
            <span className="text-gray-700 font-medium">
              {job.heading || "Job completed"}
            </span>
          </span>
        </div>
      )}
    </div>
  );
}
