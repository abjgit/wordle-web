/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'bg-green-500',
    'bg-yellow-500',
    'bg-gray-500',
    'text-white',
    'border-green-600',
    'border-yellow-600',
    'border-gray-600',
    'animate-flip',
    'animate-pop',
    'scale-105'
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
        },
        flip: {
          '0%': { transform: 'rotateX(0deg)' },
          '50%': { transform: 'rotateX(90deg)' },
          '100%': { transform: 'rotateX(0deg)' }
        }
      },
      animation: {
        'pop': 'pop 0.1s ease-in-out',
        'flip': 'flip 0.6s ease-in-out'
      }
    },
  },
  plugins: [],
}
