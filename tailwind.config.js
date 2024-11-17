/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'correct': '#6aaa64',
        'present': '#c9b458',
        'absent': '#787c7e',
        'key-bg': '#d3d6da',
      },
      keyframes: {
        pop: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        }
      },
      animation: {
        'pop': 'pop 0.1s ease-in-out',
      }
    },
  },
  plugins: [],
}
