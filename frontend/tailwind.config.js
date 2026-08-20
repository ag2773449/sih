/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#12211D',
          700: '#2B3B36',
          500: '#5B6B66',
          300: '#9AA9A4',
          100: '#E4EAE7'
        },
        teal: {
          900: '#08302F',
          700: '#0E5C5C',
          600: '#13716E',
          500: '#188A85',
          100: '#DCEFEC',
          50: '#F2F9F8'
        },
        marigold: {
          700: '#B57A1C',
          600: '#C97F1E',
          500: '#D9A441',
          200: '#F3DFB1',
          100: '#FBF0DA'
        },
        moss: {
          700: '#1F5C40',
          600: '#2E7D5B',
          100: '#DFF0E6'
        },
        clay: {
          700: '#8E2C21',
          600: '#C0392B',
          100: '#F8DEDA'
        },
        paper: '#F7F9F8'
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        body: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"Space Grotesk"', 'ui-sans-serif', 'sans-serif']
      },
      borderRadius: {
        xl2: '1.25rem'
      },
      boxShadow: {
        soft: '0 2px 10px rgba(18, 33, 29, 0.06), 0 10px 30px rgba(18, 33, 29, 0.06)',
        lift: '0 8px 24px rgba(18, 33, 29, 0.12)'
      },
      maxWidth: {
        content: '1180px'
      }
    }
  },
  plugins: []
}
