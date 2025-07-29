export default function ShareButton({ artisanId }) {
  const shareUrl = `${import.meta.env.VITE_CLIENT_URL}/artisans/${artisanId}?share=true`;

  const share = () => {
    if (navigator.share) {
      navigator.share({ title: 'Check out this artisan!', url: shareUrl });
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied!');
    }
  };

  return (
    <button
      onClick={share}
      className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
    >
      Share
    </button>
  );
}