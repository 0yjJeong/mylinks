/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{tsx,jsx}', '../packages/**/*.{tsx,jsx}'],
  theme: {
    extend: {
      keyframes: {
        moveX: {
          '0%': {
            transform: 'translateX(0)',
          },
          '100%': {
            transform: `translateX(-100px)`,
          },
        },
      },
      animation: {
        stripe: 'moveX 2s linear infinite',
      },
    },
  },
  plugins: [],
};
