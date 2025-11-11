export default function Footer() {
  return (
    <footer className="bg-white border-t mt-12">
      <div className="container mx-auto px-6 py-6 text-sm text-[#1F2937] text-center">
        <p>&copy; {new Date().getFullYear()} Abeg Fix. All rights reserved.</p>
        <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2 justify-center">
          <a href="/cookies" className="hover:underline">Cookies</a>
          <a href="/guidelines" className="hover:underline">Guidelines</a>
          <a href="/disclaimer" className="hover:underline">Disclaimer</a>
          <a href="/refund-policy" className="hover:underline">Refund</a>
          <a href="/earnings-disclaimer" className="hover:underline">Earnings</a>
          <a href="/dmca" className="hover:underline">DMCA</a>
          <a href="/safety" className="hover:underline">Safety</a>
          <a href="/data-policy" className="hover:underline">Data Policy</a>
          <a href="/about" className="hover:underline">About</a>
          <a href="/how-it-works" className="hover:underline">How It Works</a>
          <a href="/faqs" className="hover:underline">FAQs</a>
        </div>
      </div>
    </footer>
  );
}