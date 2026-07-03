/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Nunito', 'sans-serif'] },
      boxShadow: {
        card: '0 4px 24px rgba(255,98,187,0.15)',
        glow: '0 0 24px rgba(179,49,241,0.4)',
      },
    },
  },
  plugins: [],
};
