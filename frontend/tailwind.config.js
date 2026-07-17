/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Strict mapping to requested accessible color tokens
        primary: {
          light: '#4F46E5', // Indigo 600
          dark: '#6366F1',  // Indigo 500
        },
        bg: {
          light: '#F8FAFC', // Slate 50
          dark: '#0F172A',  // Slate 900
        },
        card: {
          light: '#FFFFFF',
          dark: '#1E293B',  // Slate 800
        },
        sidebar: {
          light: '#FFFFFF',
          dark: '#111827',  // Slate 950
        },
        text: {
          primary: {
            light: '#0F172A',
            dark: '#FFFFFF',
          },
          secondary: {
            light: '#475569', // Slate 600
            dark: '#CBD5E1', // Slate 300
          }
        }
      },
      boxShadow: {
        'soft-sm': '0 2px 8px -1px rgba(15, 23, 42, 0.05)',
        'soft-md': '0 4px 20px -2px rgba(15, 23, 42, 0.08)',
        'soft-lg': '0 10px 32px -4px rgba(15, 23, 42, 0.12)',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      }
    },
  },
  plugins: [],
}