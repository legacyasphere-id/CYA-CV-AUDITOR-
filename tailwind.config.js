/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Legacy dark theme (AuditView / ResultView)
        brand: {
          50:  '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Landing page palette
        cream:   { DEFAULT: '#F7F4EF', dark: '#EDE8E0' },
        ink:     '#3D3A34',
        muted:   '#7A7368',
        forest:  { DEFAULT: '#2A5C45', light: '#E8F2EC' },
        warm:    '#C4996A',
        dark:    '#1C1A17',
      },
    },
  },
  plugins: [],
}
