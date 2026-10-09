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
          50: '#FDF3F3',
          100: '#FCE7E7',
          200: '#F9D1D1',
          300: '#F4ACAC',
          400: '#EB7A7A',
          500: '#DC4444',
          600: '#B92424',
          700: '#941717',
          800: '#731010', // Official CSE VIYUGAM Accent
          900: '#540D0D',
          950: '#340606',
        },
        slate: {
          850: '#151F32',
          900: '#0F172A',
          950: '#080E1A',
        },
        brand: {
          dark: '#0A0D14',
          card: '#121824',
          border: '#1F293D',
          accent: '#731010',
          accentLight: '#941717',
          gold: '#F59E0B',
          emerald: '#10B981',
          cyan: '#06B6D4',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Fira Code', 'Consolas', 'monospace'],
      },
      boxShadow: {
        '2xs': '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'xs': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.03)',
        'card': '0 2px 8px -2px rgba(15, 23, 42, 0.05), 0 1px 4px -1px rgba(15, 23, 42, 0.03)',
        'card-hover': '0 12px 30px -4px rgba(115, 16, 16, 0.12), 0 4px 12px -2px rgba(15, 23, 42, 0.04)',
        'glow-burgundy': '0 0 25px rgba(115, 16, 16, 0.25)',
        'glow-emerald': '0 0 20px rgba(16, 185, 129, 0.25)',
        'glow-amber': '0 0 20px rgba(245, 158, 11, 0.25)',
        'modal': '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
