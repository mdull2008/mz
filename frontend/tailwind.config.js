/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f0ff',
          100: '#e2e1ff',
          200: '#c8c5ff',
          300: '#a79aff',
          400: '#8b6fff',
          500: '#7c4dff',
          600: '#6d2df2',
          700: '#5b1dd4',
          800: '#4a18ac',
          900: '#3d168a',
          950: '#240d5c',
        },
        surface: {
          50: '#f8f8fc',
          100: '#f0f0f8',
          200: '#e4e4f0',
          800: '#1a1a2e',
          850: '#16162a',
          900: '#0f0f1e',
          950: '#08080f',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
        story: ['"Palatino Linotype"', 'Palatino', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(10px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      }
    },
  },
  plugins: [],
}
