/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        neon: {
          cyan: '#00f7ff',
          blue: '#4f7cff',
          purple: '#a855f7',
          pink: '#ff4dd8',
        },
      },
      boxShadow: {
        neon: '0 0 24px rgba(0, 247, 255, 0.25)',
        glow: '0 0 30px rgba(168, 85, 247, 0.25)',
      },
      animation: {
        fadeIn: 'fadeIn 500ms ease-out',
        pulseGlow: 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%,100%': { boxShadow: '0 0 20px rgba(0,247,255,.18)' },
          '50%': { boxShadow: '0 0 36px rgba(168,85,247,.28)' },
        },
      },
    },
  },
  plugins: [],
};
