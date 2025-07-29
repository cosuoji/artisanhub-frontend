export default function ReviewCard({ review }) {
  return (
    <div className="border p-4 rounded shadow">
      <p className="text-sm">{review.comment}</p>
      <div className="flex gap-2 mt-2">
        {review.images?.map((url, i) => (
          <img key={i} src={url} alt="review" className="w-16 h-16 object-cover rounded" />
        ))}
      </div>
    </div>
  );
}