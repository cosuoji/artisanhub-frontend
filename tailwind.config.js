/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
      extend: {
        colors: {
          primary: '#1E3A8A',
          gold: '#FFD700',
          emerald: '#10B981',
          lightgray: '#F5F5F5',
          charcoal: '#1F2937',
        },
      },
    },
    safelist: [
      'bg-primary', 'bg-gold', 'bg-emerald',
      'bg-lightgray', 'bg-charcoal',
      'text-primary', 'text-gold', 'text-emerald',
      'text-lightgray', 'text-charcoal',
    ],
    plugins: [],
  };
  