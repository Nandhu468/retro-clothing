/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1c130d',
        charcoal: '#342116',
        graphite: '#56351b',
        mist: '#f3dfae',
        bone: '#d8b76f',
        silver: '#bf9150',
      },
      fontFamily: {
        display: ['Bungee', '"Bebas Neue"', 'Oswald', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.28em',
      },
      transitionDuration: {
        250: '250ms',
        400: '400ms',
      },
    },
  },
  plugins: [],
}
