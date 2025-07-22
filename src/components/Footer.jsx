export default function Footer() {
  return (
<footer className="bg-white border-t mt-12">
  <div className="container mx-auto px-6 py-6 text-sm text-[#1F2937] text-center">
    <p>&copy; {new Date().getFullYear()} ArtisanHub. All rights reserved.</p>
    <div className="mt-2 space-x-4">
      <a href="/privacy" className="hover:underline">Privacy</a>
      <a href="/terms" className="hover:underline">Terms</a>
    </div>
  </div>
</footer>
  );
}
