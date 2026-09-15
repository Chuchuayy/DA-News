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
        // Blue & white media palette (Kompas-like density, minimal styling).
        primary: {
          DEFAULT: '#2563eb',
          dark: '#1e40af',
          light: '#3b82f6',
          soft: '#eff6ff',
        },
        secondary: '#1e40af',
        ink: '#0f172a',
        'ink-soft': '#475569',
        rule: '#e2e8f0',
      },
      fontFamily: {
        sans: [
          'var(--font-sans)',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        serif: ['var(--font-serif)', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
      },
      fontSize: {
        // Media-grade typography tokens.
        kicker: ['0.7rem', { lineHeight: '1rem', letterSpacing: '0.08em' }],
        'headline-xl': ['2.25rem', { lineHeight: '2.5rem', fontWeight: '800' }],
        'headline-lg': ['1.6rem', { lineHeight: '2rem', fontWeight: '700' }],
        'headline-md': ['1.15rem', { lineHeight: '1.5rem', fontWeight: '700' }],
        'headline-sm': ['1rem', { lineHeight: '1.35rem', fontWeight: '600' }],
      },
      maxWidth: {
        page: '1200px',
      },
      spacing: {
        gutter: '1rem',
        'gutter-lg': '1.5rem',
      },
      screens: {
        xs: '420px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(15, 23, 42, 0.06)',
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
