module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'blue-dark': '#131431',
        primary: '#FBAE39',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
