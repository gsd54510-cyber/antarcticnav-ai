/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sky: {
          light: '#EAF7FC',
          card: '#F4FAFD',
          primary: '#87CEEB',
          accent: '#38BDF8',
          vivid: '#0284C7',
          dark: '#0369A1',
        },
        navy: {
          light: '#2C4E6E',
          DEFAULT: '#12304A',
          dark: '#0A1D2E',
        },
        ice: {
          50: '#F8FAFC',
          100: '#EAF7FC',
          200: '#D0EEFA',
          300: '#B0E2FA',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(18, 48, 74, 0.06), 0 2px 6px -1px rgba(18, 48, 74, 0.04)',
        'card': '0 10px 25px -5px rgba(2, 132, 199, 0.08), 0 8px 10px -6px rgba(2, 132, 199, 0.05)',
      }
    },
  },
  plugins: [],
}
