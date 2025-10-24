/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/data/*.json", // Include JSON files for dynamic classes
  ],
  // Safelist dynamic classes used in themes.json
  safelist: [
    'bg-red-500',
    'bg-blue-500',
    'bg-yellow-600',
    'bg-purple-600',
    'bg-pink-500',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        success: '#10B981',
        error: '#EF4444',
      }
    },
  },
  plugins: [],
}