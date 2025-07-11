export default function Footer() {
  return (
    <footer className="bg-white border-t mt-12">
      <div className="container mx-auto px-6 py-6 text-sm text-[#1F2937] text-center">
        &copy; {new Date().getFullYear()} ArtisanHub. All rights reserved.
      </div>
    </footer>
  );
}
