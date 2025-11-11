import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center text-white text-center px-6">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1521633246924-67d02995bb46?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }} // Replace with your actual image URL
        >
          <div className="absolute inset-0 bg-black opacity-60" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl font-bold mb-4">Find Trusted Artisans Near You</h1>
          <p className="text-lg mb-6">Connecting you with verified local handymen and professionals in your city.</p>
          <Link to="/directory" className="bg-gold text-charcoal px-6 py-3 rounded font-semibold inline-block">
            Explore Directory
          </Link>
        </div>
      </section>


      {/* Features Section */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-charcoal mb-12">Why Use Abeg Fix?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center">
          {[
            {
              title: 'Approved Artisans',
              desc: 'We ensure only vetted professionals are listed.',
            },
            {
              title: 'Local Services',
              desc: 'Find artisans who understand your local needs.',
            },
            {
              title: 'Easy Booking',
              desc: 'Hire and manage jobs all from one place.',
            },
            {
              title: 'Proximity',
              desc: 'Find help in close proximity.',
            },

          ].map((feature) => (
            <div key={feature.title} className="bg-lightgray p-6 rounded shadow">
              <h3 className="text-lg font-semibold text-primary mb-2">{feature.title}</h3>
              <p className="text-charcoal text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
