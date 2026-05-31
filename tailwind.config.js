module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './pages/**/*.{js,jsx,ts,tsx}',
    './layouts/**/*.{js,jsx,ts,tsx}',
    './data/**/*.{js,jsx,ts,tsx}',
    './context/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#F4F6F9',
        card: '#FFFFFF',

        // Gazprom Primary — Pantone 300 CV
        accent:        '#005DB9',
        'accent-dark':  '#004A94',
        'accent-light': '#E8F0FA',

        // Gazprom Silver / Technical Gray — Pantone 877 CV inspired
        silver:         '#B8BDC5',
        'silver-light': '#ECEEF2',

        muted:   '#8A919E',
        border:  '#DDE1E9',
        dark:    '#1A2533',
        secondary: '#5B6B7D',

        success:        '#1A7A4A',
        'success-light': '#D6EFE1',
        warning:        '#B45309',
        'warning-light': '#FEF3C7',
        danger:         '#C0392B',
        'danger-light':  '#FDECEA',

        // Supporting role colors (kept for individual employee avatars etc.)
        purple:        '#6D4FA0',
        'purple-light': '#EDE9F6',
        orange:        '#C05621',
        'orange-light': '#FDEEDE',
        teal:          '#0D7A6E',
        'teal-light':  '#CCEDE9',
        pink:          '#A83265',
        'pink-light':  '#F9E5EF',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        card:       '0 1px 8px rgba(26,37,51,0.07)',
        'card-hover':'0 6px 24px rgba(26,37,51,0.11)',
        sm:         '0 1px 4px rgba(26,37,51,0.05)',
        sidebar:    '2px 0 12px rgba(26,37,51,0.06)',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
