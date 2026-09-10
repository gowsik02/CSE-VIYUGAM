/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        burgundy: {
          50: '#FDF2F2',
          100: '#FCE4E4',
          200: '#F7C5C5',
          300: '#F19696',
          400: '#E85B5B',
          500: '#D92D2D',
          600: '#BA1E1E',
          700: '#9B1414',
          800: '#7A0E0E', // Official CSE VIYUGAM Accent
          900: '#5C0B0B',
          950: '#3D0707',
        },
        brand: {
          dark: '#0A0D14',
          card: '#121824',
          border: '#1F293D',
          accent: '#7A0E0E',
          accentLight: '#9B1414',
          gold: '#F59E0B',
          emerald: '#10B981',
          cyan: '#06B6D4',
        },
        neutral: {
          50: '#FAFAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
          950: '#0B0F17',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'Outfit', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.03)',
        hover: '0 10px 25px -5px rgba(122, 14, 14, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
        glow: '0 0 20px rgba(122, 14, 14, 0.25)',
        'glow-emerald': '0 0 20px rgba(16, 185, 129, 0.25)',
        'glow-amber': '0 0 20px rgba(245, 158, 11, 0.25)',
        dropdown: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
};
