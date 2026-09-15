/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // DA News brand system: white canvas, near-black text, teal accents,
        // red reserved for dates only.
        ink: '#111111',
        'ink-soft': '#6B6B6B',
        'ink-faint': '#9A9A9A',
        brand: '#00C8B8',
        'brand-dark': '#00A99C',
        date: '#FF3B30',
        rule: '#F0F0F0',
        surface: '#F5F5F5',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'Arial', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'Times New Roman', 'serif'],
      },
      maxWidth: {
        page: '1200px',
      },
      boxShadow: {
        lift: '0 12px 28px rgba(17, 17, 17, 0.12)',
        soft: '0 1px 2px rgba(17, 17, 17, 0.04)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.25s ease-out',
      },
    },
  },
  plugins: [],
};
