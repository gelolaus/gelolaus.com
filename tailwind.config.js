/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'hacker-green': '#00ff41',
        'hacker-black': '#0d0d0d',
        'hacker-gray': '#1a1a1a',
      },
      fontFamily: {
        'mono': ['"Fira Code"', 'monospace'],
      },
      // NEW: Add dynamic viewport height support
      height: {
        'screen-dynamic': '100dvh',
      },
      maxHeight: {
          'screen-dynamic': '100dvh',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}