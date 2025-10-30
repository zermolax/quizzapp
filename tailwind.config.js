/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enable dark mode with class strategy
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/data/*.json", // Include JSON files for dynamic classes
  ],
  // Safelist dynamic classes used in themes.json
  safelist: [
    // Theme colors
    'bg-brand-red',
    'bg-brand-orange',
    'bg-brand-yellow',
    'bg-brand-green',
    'bg-brand-blue',
    'bg-brand-purple',
    // Legacy support for existing code
    'bg-red-500',
    'bg-blue-500',
    'bg-yellow-600',
    'bg-purple-600',
    'bg-pink-500',
  ],
  theme: {
    extend: {
      colors: {
        // Bold Design Palette - Modern & Elegant
        'deep-brown': '#2D2416',
        'warm-brown': '#4A3D2F',
        'sand': '#C8B7A6',
        'cream': '#F5F1E8',
        'off-white': '#FAFAF8',
        'sage': '#8B9B7A',
        'terracotta': '#C07856',
        'neon-pink': '#FF0080',
        'neon-cyan': '#00FFFF',
        'neon-lime': '#CCFF00',
        'neon-orange': '#FF6B00',

        // New Brand Colors
        brand: {
          red: '#E63946',        // Roșu vibrant
          orange: '#F77F00',     // Portocaliu energic
          yellow: '#FCBF49',     // Galben solar
          green: '#06A77D',      // Verde fresh
          blue: '#1982C4',       // Albastru inteligent
          purple: '#6A4C93',     // Mov profund
        },
        // Neutral Colors
        neutral: {
          50: '#F9FAFB',         // Background light
          100: '#F3F4F6',        // Cards background
          200: '#E5E7EB',        // Borders
          500: '#6B7280',        // Text secondary
          700: '#374151',        // Text primary
          900: '#111827',        // Headers
        },
        // Semantic Colors
        success: '#06A77D',      // Verde - correct answer
        error: '#E63946',        // Roșu - wrong answer
        warning: '#F77F00',      // Portocaliu - time running out
        info: '#1982C4',         // Albastru - hints, info

        // Legacy support (kept for backward compatibility)
        primary: '#1982C4',
      },
      fontFamily: {
        'heading': ['Space Grotesk', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      letterSpacing: {
        'tighter': '-0.04em',
        'tight': '-0.02em',
      },
      lineHeight: {
        'tight': '0.95',
      },
      boxShadow: {
        'brutal': '4px 4px 0 currentColor',
        'brutal-lg': '6px 6px 0 currentColor',
        'brutal-xl': '8px 8px 0 currentColor',
      },
    },
  },
  plugins: [],
}