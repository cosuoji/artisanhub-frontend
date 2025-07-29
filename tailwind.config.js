// /** @type {import('tailwindcss').Config} */
// export default {
//   darkMode: 'class',
//   content: ['./src/**/*.{js,jsx,ts,tsx}'],
//   theme: {
//     extend: {
//       colors: {
//         // Your existing custom colors
//         primary: '#1E3A8A',
//         gold: '#FFD700',
//         emerald: '#10B981',
//         lightgray: '#F5F5F5',
//         charcoal: '#1F2937',
        
//         // Dark mode variants (recommended additions)
//         dark: {
//           primary: '#3B82F6',  // Lighter blue for better dark mode visibility
//           background: '#111827',
//           text: '#F3F4F6',
//           card: '#1F2937',
//           border: '#374151'
//         }
//       },
//       // Optional: Add dark mode variants for your custom colors
//       backgroundColor: {
//         dark: {
//           gold: 'rgba(255, 215, 0, 0.8)',  // Semi-transparent gold
//           emerald: 'rgba(16, 185, 129, 0.8)'
//         }
//       }
//     },
//   },
//   safelist: [
//     // Existing safelist classes
//     'bg-primary', 'bg-gold', 'bg-emerald',
//     'bg-lightgray', 'bg-charcoal',
//     'text-primary', 'text-gold', 'text-emerald',
//     'text-lightgray', 'text-charcoal',
    
//     // Add dark mode variants
//     'dark:bg-dark-background',
//     'dark:bg-dark-card',
//     'dark:text-dark-text',
//     'dark:border-dark-border',
//     'dark:bg-dark-primary',
//     'dark:bg-dark-gold',
//     'dark:bg-dark-emerald'
//   ],
//   plugins: [
//     require('@tailwindcss/forms'), // Optional: for better dark form styling
//     require('@tailwindcss/typography') // Optional: for prose dark mode
//   ],
// };

// tailwind.config.js
import daisyui from 'daisyui'

export default {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  plugins: [daisyui],
  daisyui: {
    themes: ['light', 'dark'], // keep only these two
  },
  safelist: [
  'btn', 'btn-primary', 'card', 'bg-base-100', 'dark:bg-base-200'
]
};